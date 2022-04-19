# -*- coding: utf-8 -*-
"""
Created on Mon Apr 18 11:02:04 2022

@author: PRATHIBHA
"""

import easyocr
import cv2
from matplotlib import pyplot as plt
#import numpy as np

  
#IMAGE_PATH = 'sign.png'
IMAGE_PATH = 'input_v2/ploted_rgb137.jpg'

reader = easyocr.Reader(['en'])
result = reader.readtext(IMAGE_PATH)
#print("results", result)

img = cv2.imread(IMAGE_PATH)
spacer = 100
for detection in result: 
    #print(detection)
    #print(result)
    top_left = tuple(detection[0][0])
    bottom_right = tuple(detection[0][2])
    text = detection[1]
    font = cv2.FONT_HERSHEY_SIMPLEX
    #status= print("\n", text)

    # Opening and Closing a file "MyFile.txt"
    # for object name file1.
    file1 = open("NewFile.txt","a+")
    file1.writelines(text)
    file1.close()

    img = cv2.rectangle(img,top_left,bottom_right,(0,255,0),3)
    img = cv2.putText(img,text,(20,spacer), font, 0.5,(0,255,0),2,cv2.LINE_AA)
    spacer+=15
    
plt.imshow(img)
plt.show()




