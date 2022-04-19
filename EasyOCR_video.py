# -*- coding: utf-8 -*-
"""
Created on Mon Apr 18 15:17:58 2022

@author: PRATHIBHA
"""

# -*- coding: utf-8 -*-
"""
Created on Mon Apr 18 11:02:04 2022

@author: PRATHIBHA
"""

import easyocr
import cv2
from matplotlib import pyplot as plt
#import numpy as np
global resized_image

vidcap = cv2.VideoCapture('ABC_Trim_2.mp4')
#success,image = vidcap.read()
vidcap.get(cv2.CAP_PROP_FPS)
count = 0

while vidcap.isOpened(): 
    
    success,image = vidcap.read()
    #resized_image = cv2.resize(img, (1200, 600))
    #plt.imshow(image)
    #image.shape
    plt.savefig('input/ploted_rgb%d.jpg' %count)  
   # plt.show()
    
    #cv2.imshow("frame",img)
    #plt.imshow(img)
    #plt.show()
    count += 1
    #return img  
      
#IMAGE_PATH = 'sign.png'

    
    reader = easyocr.Reader(['en'])
    result = reader.readtext(image)
    print("result:",result)   
        

    
    img = cv2.imread(image)
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


