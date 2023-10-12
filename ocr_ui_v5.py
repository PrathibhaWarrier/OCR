# -*- coding: utf-8 -*-
"""
Created on Thu Oct 12 16:27:13 2023

@author: PRATHIBHA
"""

import tkinter as tk
from tkinter import ttk, filedialog, messagebox
import os
import openpyxl
import cv2
import math
from scipy import ndimage
import easyocr

class A:
    def __init__(self):
        self.coordinates = []
    
    def browseFiles(self):
        filename = filedialog.askopenfilename(filetypes=(
            ("Image", "*.png*"), 
            ("Image", "*.jpg*"), 
            ("Image", "*.jpeg*"),
            ("Image", "*.tif*"),
            ("All files", "*.*")
        ))
        
        if filename:
            self.file_path = os.path.basename(filename)
            self.DIR_N0 = os.path.splitext(self.file_path)[0]
            self.label_file_explorer.configure(placeholder_text=self.DIR_N0)
            self.IMAGE_PATH = filename
            self.image = cv2.imread(self.IMAGE_PATH)
            self.image_copy = self.image.copy()
            self.image_roi = None
            cv2.setMouseCallback("image", self.shape_selection)
            cv2.imshow("image", self.image)

    def shape_selection(self, event, x, y, flags, param):
        if event == cv2.EVENT_LBUTTONDOWN:
            self.coordinates = [(x, y)]
        elif event == cv2.EVENT_LBUTTONUP:
            self.coordinates.append((x, y))
            cv2.rectangle(self.image, self.coordinates[0], self.coordinates[1], (0, 255, 0), 3)
    
    def crop_image(self):
        while True:
            cv2.imshow("image", self.image)
            key = cv2.waitKey(1) & 0xFF
            if key == 13:  # If 'enter' is pressed, apply OCR
                break
            if key == ord("c"):  # Clear the selection when 'c' is pressed
                self.image = self.image_copy.copy()
        if len(self.coordinates) == 2:
            self.image_roi = self.image_copy[
                self.coordinates[0][1]:self.coordinates[1][1],
                self.coordinates[0][0]:self.coordinates[1][0]
            ]
    
    def orientation_correction(self):
        img_gray = cv2.cvtColor(self.image_roi, cv2.COLOR_BGR2GRAY)
        img_edges = cv2.Canny(img_gray, 100, 100, apertureSize=3)
        lines = cv2.HoughLinesP(img_edges, 1, math.pi / 180.0, 100, minLineLength=100, maxLineGap=5)
        angles = []
        for x1, y1, x2, y2 in lines[0]:
            angle = math.degrees(math.atan2(y2 - y1, x2 - x1))
            angles.append(angle)
        median_angle = np.median(angles)
        img_rotated = ndimage.rotate(self.image_roi, median_angle)
        return img_rotated

    def display_text(self):
        results = self.reader.readtext(self.thresh)
        text1 = []
        for detection1 in results:
            text1.append(''.join([str(e) for e in (tuple(detection1[1]))]))
        for i in text1:
            grade_data = i.strip().split('{}')
            print(i)
            print(grade_data)
        return text1

    def export_to_excel(self, DIR_N0, Part_Number, Tube_fit, BH_diameter, Bolt_hole_axis_RT1, Bolt_hole_axis_RT2, No_bolts, RawMaterials_thick, Bracket_height, Bracket_weight):
        filepath = "Export1.xlsx"
        if not os.path.exists(filepath):
            workbook = openpyxl.Workbook()
            sheet = workbook.active
            heading = [
                "DIR No", "Part No", "RT Fit", "Bolt hole diameter", 
                "Bolt axis distance to RT 1", "Bolt axis distance to RT 2", 
                "Number of bolt holes", "Raw material thickness", 
                "Bracket height", "Bracket weight"
            ]
            sheet.append(heading)
            workbook.save(filepath)
        workbook = openpyxl.load_workbook(filepath)
        sheet = workbook.active
        sheet.append([DIR_N0, Part_Number, Tube_fit, BH_diameter, Bolt_hole_axis_RT1, Bolt_hole_axis_RT2, No_bolts, RawMaterials_thick, Bracket_height, Bracket_weight])
        workbook.save(filepath)
        print("Exported to Excel")

def main():
    root = tk.Tk()
    root.geometry("1920x1080")
    root.title("Image OCR Tool")

    A.reader = easyocr.Reader(['en'])

    A.coordinates = []
    
    label_file_explorer = tk.Entry(root, placeholder_text="File Explorer using Tkinter", width=40, height=30)
    label_file_explorer.grid(column=0, row=0, columnspan=5, padx=30, pady=40, sticky="ew")
    
    button_explore = tk.Button(root, text="Browse Files", command=A().browseFiles)
    button_explore.grid(row=0, column=6, padx=20, pady=20, sticky="ew")

    buttons = []
    entries = []
    
    for i in range(1, 10):
        button = tk.Button(root, height=20, width=20, text=str(i), command=getattr(A(), f"set_text_by_button{i}"))
        button.grid(row=i, column=0, padx=20, pady=20, sticky="ew")
        buttons.append(button)
        
        entry = tk.Entry(root, placeholder_text="CTkEntry")
        entry.grid(row=i, column=1, columnspan=3, padx=(20, 0), pady=(20, 20), sticky="nsew")
        entries.append(entry)

    excelexport = tk.Button(root, height=30, width=50, text="Export", command=export_to_excel)
    excelexport.grid(row=8, column=6, padx=20, pady=20, sticky="ew")

    root.mainloop()

if __name__ == "__main__":
    main()
