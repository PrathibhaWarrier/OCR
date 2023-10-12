# -*- coding: utf-8 -*-
"""
Created on Thu Oct 12 16:15:57 2023

@author: PRATHIBHA
"""

# -*- coding: utf-8 -*-
"""
Created on Mon Aug 21 14:25:08 2023

@author: X1PRATWA
"""

import customtkinter as ctk
import os
import openpyxl
import tkinter as tk
from tkinter import filedialog
import cv2
import pytesseract

# Specify the path to the Tesseract executable
pytesseract.pytesseract.tesseract_cmd = 'C:/Users/X1PRATWA/AppData/Local/Programs/Tesseract-OCR/tesseract.exe'

class A:
    def browseFiles(self):
        self.filename = filedialog.askopenfilename(
            filetypes=(("Image", "*.png *.jpg *.jpeg *.tif"), ("All files", "*.*"))
        )
        file_path = os.path.basename(self.filename)
        file = os.path.splitext(file_path)
        global DIR_N0
        DIR_N0 = file[0]
        label_file_explorer.configure(placeholder_text=DIR_N0)
        global image
        image = cv2.imread(self.filename)

    def shape_selection(self, event, x, y, flags, param):
        global coordinates
        if event == cv2.EVENT_LBUTTONDOWN:
            coordinates = [(x, y)]
        elif event == cv2.EVENT_LBUTTONUP:
            coordinates.append((x, y))
            cv2.rectangle(image, coordinates[0], coordinates[1], (0, 255, 0), 3)

    def crop_image(self):
        image_copy = image.copy()
        cv2.namedWindow('image', cv2.WINDOW_NORMAL)
        cv2.namedWindow("image")
        cv2.setMouseCallback("image", self.shape_selection)

        while True:
            cv2.imshow("image", image)
            key = cv2.waitKey(1) & 0xFF

            if key == 13:  # If 'enter' is pressed, apply OCR
                break

            if key == ord("c"):  # Clear the selection when 'c' is pressed
                image = image_copy.copy()

        if len(coordinates) == 2:
            global image_roi
            image_roi = image_copy[coordinates[0][1]:coordinates[1][1], coordinates[0][0]:coordinates[1][0]]
            cv2.imshow("cropped", image_roi)
            cv2.waitKey(0)

        custom_symbols = {'Φ': 0, 'Ψ': 1}
        results = pytesseract.image_to_string(image_roi, config='--psm 6', lang='custom_symbols+eng')
        recog_sym = [custom_symbols[char] for char in results if char in custom_symbols]
        print("REC:", recog_sym)

    def __del__(self):
        print("Function object destroyed")

ctk.set_appearance_mode("Dark")
ctk.set_default_color_theme("blue")

window = ctk.CTk()

def set_text_by_button1():
    entry1.delete(0, "end")
    text1 = A()
    text1.crop_image()
    entry1.insert(0, results)
    del text1

def DelAll():
    entry1.delete(0, "end")

label_file_explorer = ctk.CTkEntry(
    window, placeholder_text="File Explorer using Tkinter", width=40, height=30
)
label_file_explorer.grid(
    column=0, row=0, columnspan=5, padx=30, pady=40, sticky="ew"
)

button_explore = ctk.CTkButton(
    window, text="Browse Files", command=A().browseFiles
)
button_explore.grid(row=0, column=6, padx=20, pady=20, sticky="ew")

Delete_all_button = ctk.CTkButton(
    window, text="Clear All", command=DelAll
)
Delete_all_button.grid(row=0, column=7, padx=20, pady=20, sticky="ew")

set_up_button1 = ctk.CTkButton(
    window, text="1", command=set_text_by_button1
)
set_up_button1.grid(row=1, column=0, padx=20, pady=20, sticky="ew")

entry1 = ctk.CTkEntry(window, placeholder_text="CTkEntry")
entry1.grid(
    row=1, column=1, columnspan=3, padx=(20, 0), pady=(20, 20), sticky="nsew"
)

window.mainloop()
