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

        self.ocr_button = tk.Button(self.root, text="OCR", command=self.perform_ocr)
        self.ocr_button.pack()

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
        self.current_image = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
        self.render = ImageTk.PhotoImage(image=self.current_image)
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
        self.image_window = tk.Toplevel(self.root)
        self.render_page(self.doc.load_page(self.page_number))
        photo = ImageTk.PhotoImage(self.pages_as_images[self.page_number])
        self.label = tk.Label(self.image_window, image=photo)
        self.label.image = photo
        self.label.pack()

        self.canvas_in_label = tk.Canvas(self.label)
        self.canvas_in_label.pack(fill=tk.BOTH, expand=True)
        self.label.bind("<ButtonPress-1>", self.on_button_press)
        self.label.bind("<B1-Motion>", self.on_move_press)
        self.rect = None
        self.start_x = None
        self.start_y = None

    def on_button_press(self, event):
        self.start_x = self.canvas_in_label.canvasx(event.x)
        self.start_y = self.canvas_in_label.canvasy(event.y)
        if self.rect:
            self.canvas_in_label.delete(self.rect)

    def on_move_press(self, event):
        if self.rect:
            self.canvas_in_label.delete(self.rect)
        cur_x = self.canvas_in_label.canvasx(event.x)
        cur_y = self.canvas_in_label.canvasy(event.y)
        self.rect = self.canvas_in_label.create_rectangle(self.start_x, self.start_y, cur_x, cur_y, outline='red')

    def perform_ocr(self):
        if self.current_image and self.rect:
            region = self.canvas_in_label.coords(self.rect)
            x0, y0, x1, y1 = int(region[0]), int(region[1]), int(region[4]), int(region[5])
            cropped_image = self.current_image.crop((x0, y0, x1, y1))
            # Perform OCR on the cropped image
            # Implement OCR using your preferred library, for example, EasyOCR

if __name__ == "__main__":
    root = tk.Tk()
    pdf_viewer = PDFViewer(root)
    root.mainloop()
