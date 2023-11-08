# -*- coding: utf-8 -*-
"""
Created on Mon Aug 21 14:25:08 2023

@author: X1PRATWA
"""


# -*- coding: utf-8 -*-
"""
Created on Mon Aug 21 12:52:10 2023

@author: X1PRATWA
"""

import customtkinter as ctk
# import tkinter
# from tkinter import ttk
# from tkinter import messagebox
import os
import openpyxl
# import importlib
from tkinter import filedialog
import easyocr
import cv2
# from matplotlib import pyplot as plt
# import pandas as pd
class A():
    def browseFiles():
        # global filename
        filename = filedialog.askopenfilename(filetypes = (("Image", "*.png*"), ("Image", "*.jpg*"), ("Image", "*.jpeg*"),("Image", "*.tif*"),("all files", "*.*")))
        
        file_path = os.path.basename(filename)
        file = os.path.splitext(file_path)
        global DIR_N0
        DIR_N0=file[0]
        label_file_explorer.configure(placeholder_text=DIR_N0)

        # print(file) # returns tuple of string

        print(file[0])

        # print(filename)
        IMAGE_PATH = filename
        # reader = easyocr.Reader(['en'])Q
        global image
        image = cv2.imread(IMAGE_PATH)
        # spacer = 100

        # coordinates = []

    
    global x, y, flags, param
    def shape_selection(self, event, x, y, flags, param):
        # making coordinates global
        print("entering")
        param = 3
        flags=(0, 255, 0)
        global coordinates

        # Storing the (x1,y1) coordinates when left mouse button is pressed
        if event == cv2.EVENT_LBUTTONDOWN:
            coordinates = [(x, y)]

        # Storing the (x2,y2) coordinates when the left mouse button is released and make a rectangle on the selected region
        elif event == cv2.EVENT_LBUTTONUP:
            coordinates.append((x, y))
     
            # Drawing a rectangle around the region of interest (roi)
            # font = cv2.FONT_HERSHEY_SIMPLEX

            # cv2.rectangle(image, coordinates[0], coordinates[1], (0, 255, 0), 3)
            # cv2.putText(img,(20,spacer), font, 0.5,(0,255,0),2,cv2.LINE_AA)
            # cv2.imshow("image", image)
            cv2.rectangle(image, coordinates[0], coordinates[1], flags, param)
            # cv2.putText(self,self.img,(20,self.spacer), font, 0.5,(0,255,0),2,cv2.LINE_AA)
            # cv2.imshow("image", image)
        
    def crop_image(self):
        global image
        image_copy = image.copy()
        cv2.namedWindow('image', cv2.WINDOW_NORMAL)
        cv2.namedWindow("image")
        cv2.setMouseCallback("image", self.shape_selection)
        

        # keep looping until the 'q' key is pressed
        while True:
        # display the image and wait for a keypress
            cv2.imshow("image", image)
            key = cv2.waitKey(1) & 0xFF

            if key == 13:  # If 'enter' is pressed, apply OCR
                break

            if key == ord("c"):  # Clear the selection when 'c' is pressed
                image = image_copy.copy()
            
        if len(coordinates) == 2:
            global image_roi
            image_roi = image_copy[coordinates[0][1]:coordinates[1][1],
                           coordinates[0][0]:coordinates[1][0]]
            cv2.imshow("cropped", image_roi)
            # cv2.namedWindow("cropped image")
            cv2.waitKey(0)


        # closing all open windows
        cv2.destroyAllWindows()
        
        
        global results
        reader = easyocr.Reader(['da'], gpu=False)
        results = reader.readtext(image_roi)
        # cv2.destroyWindow("cropped")
        # text = pytesseract.image_to_string(image_roi)
        print("The text in the selected region is as follows:")
        # print(results)
        text1 = []

    @staticmethod
    def display_text():
        text1=[]
        for detection1 in results:
            text1.append(''.join([str(e) for e in (tuple(detection1[1]))]))

        for i in text1:
            grade_data = i.strip().split('{}')
            print(i)
            print(grade_data)
        return text1
        # for line in text1:
        #     grade_data = line.strip().split(',')
        #     print(grade_data)
        
    
    
    def __del__(self):
        print("Function object destroyed")
 


 
ctk.set_appearance_mode("Dark")

# Supported themes : green, dark-blue, blue
ctk.set_default_color_theme("blue")

appWidth, appHeight = 1920 , 1080
# 124, 800


# Creating the GUI window.
window = ctk.CTk()


def set_text_by_button1():
    # from OCR_ROI_v1 import A
    entry1.delete(0,"end")
    print(type(entry1))
    text1=A()
    text1.crop_image()
    entry1.insert(0,text1.display_text())
    del text1
    

def set_text_by_button2():
    # from OCR_ROI_v1 import A
    entry2.delete(0,"end")
    print(type(entry1))
    text2=A()
    text2.crop_image()
    entry2.insert(0,text2.display_text())
    del text2
   
   # from OCR_ROI_v1 import display_text  
   # entry2.insert(0,display_text())
  


def set_text_by_button3():
    # from OCR_ROI_v1 import A
    entry3.delete(0,"end")
    print(type(entry1))
    text3=A()
    text3.crop_image()
    entry3.insert(0,text3.display_text())
    del text3

def set_text_by_button4():
    # from OCR_ROI_v1 import A
    entry4.delete(0,"end")
    print(type(entry1))
    text4=A()
    text4.crop_image()
    entry4.insert(0,text4.display_text())
    del text4

def set_text_by_button5():
    # from OCR_ROI_v1 import A
    entry5.delete(0,"end")
    print(type(entry1))
    text5=A()
    text5.crop_image()
    entry5.insert(0,text5.display_text())
    del text5

def set_text_by_button6():
    # from OCR_ROI_v1 import A
    entry6.delete(0,"end")
    print(type(entry1))
    text6=A()
    text6.crop_image()
    entry6.insert(0,text6.display_text())
    del text6
    
def set_text_by_button7():
    # from OCR_ROI_v1 import A
    entry7.delete(0,"end")
    print(type(entry1))
    text7=A()
    text7.crop_image()
    entry7.insert(0,text7.display_text())
    del text7

def set_text_by_button8():
    # from OCR_ROI_v1 import A
    entry8.delete(0,"end")
    print(type(entry1))
    text8=A()
    text8.crop_image()
    entry8.insert(0,text8.display_text())
    del text8

def set_text_by_button9():
    # from OCR_ROI_v1 import A
    entry9.delete(0,"end")
    print(type(entry1))
    text9=A()
    text9.crop_image()
    entry9.insert(0,text9.display_text())
    del text9

def DelAll():
    entry1.delete(0,"end")
    entry2.delete(0,"end")
    entry3.delete(0,"end")
    entry4.delete(0,"end")
    entry5.delete(0,"end")
    entry6.delete(0,"end")
    entry7.delete(0,"end")
    entry8.delete(0,"end")
    
def ExcelExport():
    DIR = DIR_N0
    Part_Number = entry1.get()
    Tube_fit = entry2.get()
    BH_diameter = entry3.get()
    Bolt_hole_axis_RT1 = entry4.get()
    Bolt_hole_axis_RT2  = entry5.get()
    No_bolts = entry6.get()
    RawMaterials_thick = entry7.get()
            
            # Course info
    Bracket_height = entry8.get()
    Bracket_weight = entry9.get()
    # Wings_opening = entry10.get()
    # Offset_RTaxis = entry10.get()
    # Cal_Mass= entry10.get()
    
    # numsemesters = entry8.get()
     
    filepath = "Export1.xlsx"
    
    if not os.path.exists(filepath):
        workbook = openpyxl.Workbook()
        sheet = workbook.active
        heading = ["1","2", "3", "4", "5", "6", "7", "8"]
       
        # heading = ["DIR No","Part No", "RT Fit", "Bolt hole diameter ", "Bolt axis distance to RT 1 ", "Bolt axis distance to RT 2", "Number of bolt holes",
        #                 "Raw material thickness", "Bracket height", "Bracket width"]
        # sheet.append(heading)
        workbook.save(filepath)
        
    workbook = openpyxl.load_workbook(filepath)
    sheet = workbook.active
    sheet.append([DIR, Part_Number, Tube_fit, BH_diameter, Bolt_hole_axis_RT1, Bolt_hole_axis_RT2, No_bolts, RawMaterials_thick, Bracket_height, Bracket_weight,])
    workbook.save(filepath)
    print("and doner")

main_frame = ctk.CTkFrame(window)
# main_frame.pack(expand=1)

# Create A Canvas
my_canvas = ctk.CTkCanvas(main_frame)
# my_canvas.pack(expand=1)


# main_frame =ctk.CTkFrame(window)
# main_frame.pack(fill=BOTH, expand=1)

# Create A Canvas
# my_canvas = ctk.CTkCanvas(main_frame)
# scrollable_frame = ctk.CTkScrollbar(window, width=200, height=200,  command=my_canvas.yview)
# scrollable_frame.grid(row=11, column=1, sticky='ns')

# my_canvas.configure(yscrollcommand=scrollable_frame.set)
    
label_file_explorer = ctk.CTkEntry(window,
							placeholder_text = "File Explorer using Tkinter",
							width =40, height = 30)

label_file_explorer.grid(column = 0, row = 0, columnspan=5, padx=30, pady=40,sticky="ew")
	
button_explore = ctk.CTkButton(window,
						text = "Browse Files",
						command = A.browseFiles)


button_explore.grid(row=0, column=6, padx=20, pady=20,sticky="ew")
# (row=0, column=7, columnspan=2,  padx=(20, 0), pady=(20, 20), sticky="nsew")
# (column = 0, row = 0, padx=20, pady=30,sticky="ew")
                    # , width=10, height=1)

Delete_all_button = ctk.CTkButton(window, width =40, height = 30, text="   CLear All    ",
 					command=DelAll)

Delete_all_button.grid(row=0, column=7, padx=20, pady=20,sticky="ew")
    
set_up_button1 = ctk.CTkButton(window, height=20, width=20, text="   1   ",
 					command=set_text_by_button1)

set_up_button1.grid(row=1, column=0, padx=20, pady=20,sticky="ew")

entry1 = ctk.CTkEntry(window, placeholder_text="CTkEntry")
entry1.grid(row=1, column=1, columnspan=3, padx=(20, 0), pady=(20, 20), sticky="nsew")
print(entry1)

set_up_button2 = ctk.CTkButton(window, height=20, width=20, text="2",
 					command=set_text_by_button2)

set_up_button2.grid(row=2, column=0,padx=20, pady=20,sticky="ew")

entry2 = ctk.CTkEntry(window, placeholder_text="CTkEntry")
entry2.grid(row=2, column=1, columnspan=2, padx=(20, 0), pady=(20, 20), sticky="nsew")

set_up_button3 = ctk.CTkButton(window, height=20, width=20, text="3",
 					command=set_text_by_button3)

set_up_button3.grid(row=3, column=0,padx=20, pady=20,sticky="ew")

entry3 = ctk.CTkEntry(window, placeholder_text="CTkEntry")
entry3.grid(row=3, column=1, columnspan=2, padx=(20, 0), pady=(20, 20), sticky="nsew")

set_up_button4 = ctk.CTkButton(window, height=20, width=20, text="4",
 					command=set_text_by_button4)

set_up_button4.grid(row=4, column=0,padx=20, pady=20,sticky="ew")

entry4 = ctk.CTkEntry(window, placeholder_text="CTkEntry")
entry4.grid(row=4, column=1, columnspan=2, padx=(20, 0), pady=(20, 20), sticky="nsew")

set_up_button5 = ctk.CTkButton(window, height=20, width=20, text="5",
 					command=set_text_by_button5)

set_up_button5.grid(row=5, column=0,padx=20, pady=20,sticky="ew")

entry5 = ctk.CTkEntry(window, placeholder_text="CTkEntry")
entry5.grid(row=5, column=1, columnspan=2, padx=(20, 0), pady=(20, 20), sticky="nsew")

set_up_button6 = ctk.CTkButton(window, height=20, width=20, text="6",
 					command=set_text_by_button6)

set_up_button6.grid(row=6, column=0,padx=20, pady=20,sticky="ew")

entry6 = ctk.CTkEntry(window, placeholder_text="CTkEntry")
entry6.grid(row=6, column=1, columnspan=2, padx=(20, 0), pady=(20, 20), sticky="nsew")

set_up_button7 = ctk.CTkButton(window, height=20, width=20, text="7",
 					command=set_text_by_button7)

set_up_button7.grid(row=7, column=0,padx=20, pady=20,sticky="ew")

entry7 = ctk.CTkEntry(window, placeholder_text="CTkEntry")
entry7.grid(row=7, column=1, columnspan=2, padx=(20, 0), pady=(20, 20), sticky="nsew")

set_up_button8 = ctk.CTkButton(window, height=20, width=20, text="8",
 					command=set_text_by_button8)

set_up_button8.grid(row=8, column=0,padx=20, pady=20,sticky="ew")

entry8 = ctk.CTkEntry(window, placeholder_text="CTkEntry")
entry8.grid(row=8, column=1, columnspan=2, padx=(20, 0), pady=(20, 20), sticky="nsew")

set_up_button9 = ctk.CTkButton(window, height=20, width=20, text="9",
 					command=set_text_by_button9)

set_up_button9.grid(row=9, column=0,padx=20, pady=20,sticky="ew")

entry9 = ctk.CTkEntry(window, placeholder_text="CTkEntry")
entry9.grid(row=9, column=1, columnspan=2, padx=(20, 0), pady=(20, 20), sticky="nsew")


# set_up_button10 = ctk.CTkButton(window, height=1, width=10, text="10",
#  					command=set_text_by_button7)

# set_up_button10.grid(row=10, column=0,padx=20, pady=20,sticky="ew")

# entry10 = ctk.CTkEntry(window, placeholder_text="CTkEntry")
# entry10.grid(row=10, column=1, columnspan=2, padx=(20, 0), pady=(20, 20), sticky="nsew")


# set_up_button8 = ctk.CTkButton(window, height=1, width=10, text="Set",
#  					command=set_text_by_button)

# set_up_button8.grid(row=7, column=0,padx=20, pady=20,sticky="ew")

# entry8 = ctk.CTkEntry(window, placeholder_text="CTkEntry")
# entry8.grid(row=7, column=1, columnspan=2, padx=(20, 0), pady=(20, 20), sticky="nsew")

excelexport = ctk.CTkButton(window, height=30, width=50, text="  Export  ",
 					command=ExcelExport)

excelexport.grid(row=8, column=6,padx=20, pady=20,sticky="ew")

window.mainloop()








