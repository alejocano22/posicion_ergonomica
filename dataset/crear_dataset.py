import os
import csv
import numpy as np
import json
import random
from compute_angle import compute_final_score


def readFolders():
    _files = []
    _dirs = []

    for root, dirs, files in os.walk("./keypoints", topdown=False):
        for name in files:
            _files.append(os.path.join(root, name))
        for name in dirs:
            _dirs.append(os.path.join(root, name))

    return _files, _dirs


def write_in_file(information, writer=None,):
    with open('data.csv', 'a+', newline='') as file:
        writer = csv.writer(file)
        writer.writerow([information[0], information[1], information[2], information[3], information[4],
                         information[5], information[6], information[7], information[8], information[9],
                         information[10], information[11], information[12], information[13], information[14],
                         information[15], information[16], information[17], information[18], information[19],
                         information[20], information[21], information[22], information[23], information[24], information[25], information[26]])



if __name__ == "__main__":
    with open('data.csv', 'w+', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(["Nose", "Neck", "RShoulder", "RElbow", "RWrist", "LShoulder", "LElbow", "LWrist", "MidHip", "RHip", "RKnee", "RAnkle",
                         "LHip", "LKnee", "LAnkle", "REye", "LEye", "REar", "LEar", "LBigToe", "LSmallToe", "LHeel", "RBigToe", "RSmallToe", "RHeel", "Background", "tag"])

    files, folders = readFolders()
    for file in files:
        with open(file) as json_file:
            data = json.loads(json_file.read())
            keypoints = []
            count = 0
            aux = 0
            aux_json = None
            json_este_es = None
            for person in data['people']:
                count = np.count_nonzero(person['pose_keypoints_2d'])
                if(aux == 0):
                    aux = count
                    aux_json = person['pose_keypoints_2d']

                if(count > aux):
                    json_este_es = person['pose_keypoints_2d']
                    aux = count
                    aux_json = person['pose_keypoints_2d']
                else:
                    json_este_es = aux_json

            information_aux = np.array(json_este_es).reshape(25, 3)
            score_rula = compute_final_score(information_aux)                        
            information = list(map(lambda x: "{},{}".format(x[0], x[1]), information_aux))
            information.append(0)
            information.append(score_rula)
            write_in_file(information)
