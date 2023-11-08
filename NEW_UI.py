# -*- coding: utf-8 -*-
"""
Created on Wed Nov  8 16:27:34 2023

@author: PRATHIBHA
"""

import fitz
import tkinter as tk
from tkinter import filedialog
from PIL import Image, ImageTk

class PDFViewer:
    def __init__(self, root):
        self.root = root
        self.root.title("PDF Viewer")

        self.doc = None
        self.page_number = 0
        self.total_pages = 0
        self.pages_as_images = []

        self.canvas = tk.Canvas(self.root)
        self.canvas.pack()

        self.prev_button = tk.Button(self.root, text="Previous", command=self.show_previous_page)
        self.prev_button.pack(side=tk.LEFT)

        self.next_button = tk.Button(self.root, text="Next", command=self.show_next_page)
        self.next_button.pack(side=tk.RIGHT)

        self.view_button = tk.Button(self.root, text="View", command=self.view_pdf_pages)
        self.view_button.pack()

        self.open_pdf()

    def open_pdf(self):
        pdf_file = filedialog.askopenfilename(filetypes=[("PDF files", "*.pdf")])
        if pdf_file:
            self.doc = fitz.open(pdf_file)
            self.page_number = 0
            self.total_pages = self.doc.page_count
            self.show_page()

    def show_page(self):
        if self.doc is not None and self.page_number < self.total_pages:
            page = self.doc.load_page(self.page_number)
            self.render_page(page)

    def render_page(self, page):
        self.canvas.delete("all")
        pix = page.get_pixmap()
        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
        self.render = ImageTk.PhotoImage(image=img)
        self.canvas.create_image(0, 0, anchor="nw", image=self.render)

    def show_previous_page(self):
        if self.page_number > 0:
            self.page_number -= 1
            self.show_page()

    def show_next_page(self):
        if self.page_number < self.total_pages - 1:
            self.page_number += 1
            self.show_page()

    def view_pdf_pages(self):
        if self.doc is not None:
            self.pages_as_images = []
            for i in range(self.total_pages):
                page = self.doc.load_page(i)
                pix = page.get_pixmap()
                img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                self.pages_as_images.append(img)

            self.create_image_frame()

    def create_image_frame(self):
        image_window = tk.Toplevel(self.root)
        for i, image in enumerate(self.pages_as_images):
            photo = ImageTk.PhotoImage(image)
            label = tk.Label(image_window, image=photo)
            label.image = photo
            label.pack()

if __name__ == "__main__":
    root = tk.Tk()
    pdf_viewer = PDFViewer(root)
    root.mainloop()
