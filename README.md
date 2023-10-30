# OCRtry:
    from PIL import Image
except ImportError:
    import Image
import pytesseract

# Path to Tesseract executable (modify accordingly if necessary)
pytesseract.pytesseract.tesseract_cmd = r'/usr/bin/tesseract'

# Your text image file
img_path = 'path_to_your_image.png'

# Perform OCR for English
text_english = pytesseract.image_to_string(Image.open(img_path), lang='eng')

# Perform OCR for Danish
text_danish = pytesseract.image_to_string(Image.open(img_path), lang='dan')

# Filter out 'ø' characters detected as Danish
danish_chars = set('ø')
filtered_chars = [char for char in text_danish if char in danish_chars]

# Iterate through the English text and mark 'ø' characters as Danish
final_text = ""
for char in text_english:
    if char in filtered_chars:
        final_text += f"({char})"  # Marking 'ø' characters detected in English as Danish
    else:
        final_text += char

# Process the final text
print(final_text)
