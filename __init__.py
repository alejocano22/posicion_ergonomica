from flask import Flask, request
from shutil import rmtree
import requests
import os
import subprocess
from flask_cors import CORS
import json
import numpy as np
import joblib
from sklearn.preprocessing import StandardScaler
from base64 import b64encode

app = Flask(__name__)
CORS(app)


def to_base64(image_path):
    """
    Return an encoded base64 string of an image.
    :param image_path: The image path of the image.
    :return: An encoded base64 string.
    """

    with open(image_path, "rb") as image_file:
        encoded_string = b64encode(image_file.read())
    return "data:image/jpeg;base64,{}".format(encoded_string.decode('utf-8'))


def readFolders():
    _files = []
    _dirs = []

    for root, dirs, files in os.walk("tmp", topdown=False):
        for name in files:
            _files.append(os.path.join(root, name))
        for name in dirs:
            _dirs.append(os.path.join(root, name))

    return _files, _dirs


@app.route("/")
def hello():
    return "Api!!!!!!!!!!!!!!!!!!!!!!!"


@app.route("/proccess", methods=["POST"])
def proccess():
    data = request.get_json()

    if data == None:
        return "Error el json esta vacio o es invalido"

    print("Realizando descarga del archivo... Petición a: {}".format(
        data['url']))
    # Descarga de archivo
    r = requests.get(data['url'])
    open('tmp/{}'.format(data['filename']), 'wb').write(r.content)

    # Procesado del video...
    folderName = data['filename'][:data['filename'].find('.')]
    os.mkdir("tmp/{}".format(folderName))  # Se crean las carpetas
    os.mkdir("tmp/{}/keyframes".format(folderName))
    os.mkdir("tmp/{}/images".format(folderName))
    patch = "C:/Users/wmuno/Documents/universidad/septimo_semestre/integrador/openpose"

    subprocess.call("start /WAIT /B {a}/build/bin\OpenPoseDemo.exe --video tmp/{b} --display 0 --frame_step 20 --write_images tmp/{c}/images --write_json tmp/{c}/keyframes --model_folder {a}/models &"
                    .format(a=patch, b=data['filename'], c=folderName), shell=True)

    list_of_response = []
    files, folders = readFolders()
    for _file in files:
        if _file.endswith(".json"):
            with open(_file) as json_file:
                data_ = json.loads(json_file.read())
                keypoints = []
                count = 0
                aux = 0
                aux_json = None
                json_este_es = None
                for person in data_['people']:
                    count = np.count_nonzero(person['pose_keypoints_2d'])
                    if aux == 0:
                        aux = count
                        aux_json = person['pose_keypoints_2d']

                    if count > aux:
                        json_este_es = person['pose_keypoints_2d']
                        aux = count
                        aux_json = person['pose_keypoints_2d']
                    else:
                        json_este_es = aux_json

                information_aux = np.array(json_este_es).reshape(25, 3)
                information_aux = information_aux[:, 0:2]
                information_aux = information_aux.reshape(1, -1)

                loaded_model = joblib.load("model.sav")
                prediction = loaded_model.predict(information_aux)
                if prediction[0] == 1:
                    # image_name = file[:file.find('\\keyframes')] + "/images/" + file[file.find('keyframes\\')]
                    image_name = _file
                    image_name = _file[:_file.find(
                        '_keypoints.')] + "_rendered.png"
                    image_name = image_name.replace('keyframes', 'images')

                    list_of_response.append(
                        to_base64("{}".format(image_name)))

    rmtree('tmp/{}'.format(folderName))  # Se eliminan los archivos temporales
    os.remove('tmp/{}'.format(data['filename']))
    return json.dumps(list_of_response)
