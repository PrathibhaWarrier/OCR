# -*- coding: utf-8 -*-
"""
Created on Mon Apr 18 15:17:58 2022

@author: PRATHIBHA
"""
import easyocr
import cv2
import glob
from matplotlib import pyplot as plt

vidcap = cv2.VideoCapture('ABC_Trimmm_2.mp4')
success,image = vidcap.read()
count = 0
while success:
    cv2.imwrite("input/frame%d.jpg" % count, image)  
    success,image = vidcap.read()
    print('Read a new frame: ', success)
    count += 1  
   
IMAGE_PATH = 'D:/ML/EasyOCR-main/input/*.*' 
#print(IMAGE_PATH)
my_list=[]
for file in glob.glob(IMAGE_PATH):
    print(file)
    img = cv2.imread(file)
    my_list.append(img)    

    reader = easyocr.Reader(['en'])
    result = reader.readtext(file)
    print("result:",result)   
    
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


