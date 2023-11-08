# # -*- coding: utf-8 -*-
# """
# Created on Thu Nov  2 21:51:16 2023

# @author: X1PRATWA
# """

# import fitz  # PyMuPDF
# from tkinter import *
# from tkinter import filedialog
# from PIL import Image, ImageTk
# import pytesseract

# class PDFViewer:
#     def __init__(self, root):
#         self.root = root
#         self.root.title("PDF Viewer")
#         self.root.geometry("600x650")
#         self.pdf_document = None
#         self.current_page = 0

#         self.image_label = Label(root)
#         self.image_label.pack(expand=True)

#         open_button = Button(root, text="Open PDF", command=self.open_file)
#         open_button.pack()

#         prev_button = Button(root, text="Previous Page", command=self.show_previous_page)
#         prev_button.pack()

#         next_button = Button(root, text="Next Page", command=self.show_next_page)
#         next_button.pack()

#     def open_file(self):
#         file_path = filedialog.askopenfilename(filetypes=[("PDF files", "*.pdf")])
#         if file_path:
#             self.pdf_document = fitz.open(file_path)
#             self.current_page = 0
#             self.show_page()

#     def show_page(self):
#         if self.pdf_document:
#             page = self.pdf_document.load_page(self.current_page)
#             page_pixmap = page.get_pixmap()
#             img = Image.frombytes("RGB", [page_pixmap.width, page_pixmap.height], page_pixmap.samples)
#             img = ImageTk.PhotoImage(img)

#             self.image_label.config(image=img)
#             self.image_label.image = img
#             print(type(img))

#             # Perform OCR on the current page
#             text = self.perform_ocr(img)
#             print(f"Page {self.current_page + 1} Text:")
#             print(text)

#     def show_next_page(self):
#         if self.pdf_document and self.current_page < self.pdf_document.page_count - 1:
#             self.current_page += 1
#             self.show_page()

#     def show_previous_page(self):
#         if self.pdf_document and self.current_page > 0:
#             self.current_page -= 1
#             self.show_page()

#     @staticmethod
#     def perform_ocr(img):
#         text = pytesseract.image_to_string(img)
#         return text

# def main():
#     root = Tk()
#     pdf_viewer = PDFViewer(root)
#     root.mainloop()

# if __name__ == "__main__":
#     main()

# -*- coding: utf-8 -*-
"""
Created on Thu Nov  2 21:45:31 2023

@author: X1PRATWA
"""

import pytesseract
import fitz  # PyMuPDF
from tkinter import *
from tkinter import filedialog
from PIL import Image, ImageTk
import numpy as np
import cv2
import math
from scipy import ndimage
import pytesseract



class PDFViewer:
    
    def __init__(self, root):
        self.root = root
        self.root.title("PDF Viewer")
        self.root.geometry("600x650")
        self.pdf_document = None
        self.current_page = 0

        self.image_label = Label(root)
        self.image_label.pack(expand=True)

        open_button = Button(root, text="Open PDF", command=self.open_file)
        open_button.pack()

        prev_button = Button(root, text="Previous Page", command=self.show_previous_page)
        prev_button.pack()

        next_button = Button(root, text="Next Page", command=self.show_next_page)
        next_button.pack()

    def open_file(self):
        file_path = filedialog.askopenfilename(filetypes=[("PDF files", "*.pdf")])
        if file_path:
            self.pdf_document = fitz.open(file_path)
            self.current_page = 0
            self.show_page()

    def show_page(self):
        if self.pdf_document:
            page = self.pdf_document.load_page(self.current_page)
            page_pixmap = page.get_pixmap()
            global img
            img = Image.frombytes("RGB", [page_pixmap.width, page_pixmap.height], page_pixmap.samples)
            img = ImageTk.PhotoImage(img)

            self.image_label.config(image=img)
            self.image_label.image = img
            print(type(img))

            # Perform OCR on the current page
            text = self.perform_ocr(img)
            print(f"Page {self.current_page + 1} Text:")
            print(text)

    def show_next_page(self):
        if self.pdf_document and self.current_page < self.pdf_document.page_count - 1:
            self.current_page += 1
            self.show_page()

    def show_previous_page(self):
        if self.pdf_document and self.current_page > 0:
            self.current_page -= 1
            self.show_page()
    
    @staticmethod
    def perform_ocr(img):
        text = pytesseract.image_to_string(img)
        IMAGE_PATH = img
        # reader = easyocr.Reader(['en'])Q
        global image
        image = cv2.imread(IMAGE_PATH)
        return text
    
    # def browseFiles():
      
    #     IMAGE_PATH = img
    #     # reader = easyocr.Reader(['en'])Q
    #     global image
    #     image = cv2.imread(IMAGE_PATH)
    #     # spacer = 100

    #     # coordinates = []

    
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
 
    
    @staticmethod
    def perform_ocr(img):
        text = pytesseract.image_to_string(img)
        return text

def main():
    root = Tk()
    pdf_viewer = PDFViewer(root)
    root.mainloop()

if __name__ == "__main__":
    main()