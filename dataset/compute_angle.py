import numpy as np

body_parts = [
     "Nose",
     "Neck",
     "RShoulder",
     "RElbow",
     "RWrist",
     "LShoulder",
     "LElbow",
     "LWrist",
     "MidHip",
     "RHip",
     "RKnee",
     "RAnkle",
     "LHip",
     "LKnee",
     "LAnkle",
     "REye",
     "LEye",
     "REar",
     "LEar",
     "LBigToe",
     "LSmallToe",
     "LHeel",
     "RBigToe",
     "RSmallToe",
     "RHeel",
     "Background",
]
body_parts = {body_parts[i]:i for i in range(len(body_parts))}

def angle_between(v1, v2):
    dot_pr = v1.dot(v2)
    norms = np.linalg.norm(v1) * np.linalg.norm(v2)
    return np.rad2deg(np.arccos(dot_pr / norms))

def compute_arm_angle_right(pose_keypoints_2d, body_parts):
    coordinates_right_shoulder = pose_keypoints_2d[body_parts["RShoulder"]][0:2]
    coordinates_right_wrist = pose_keypoints_2d[body_parts["RWrist"]][0:2]
    coordinates_right_hip = pose_keypoints_2d[body_parts["RHip"]][0:2]
    return angle_between(coordinates_right_wrist - coordinates_right_shoulder, coordinates_right_hip - coordinates_right_shoulder)

def compute_arm_angle_left(pose_keypoints_2d, body_parts):
    coordinates_left_shoulder = pose_keypoints_2d[body_parts["LShoulder"]][0:2]
    coordinates_left_wrist = pose_keypoints_2d[body_parts["LWrist"]][0:2]
    coordinates_left_hip = pose_keypoints_2d[body_parts["LHip"]][0:2]
    return angle_between(coordinates_left_wrist - coordinates_left_shoulder, coordinates_left_hip - coordinates_left_shoulder)

def compute_forearm_angle_left(pose_keypoints_2d, body_parts):
    coordinates_left_shoulder = pose_keypoints_2d[body_parts["LShoulder"]][0:2]
    coordinates_left_elbow = pose_keypoints_2d[body_parts["LElbow"]][0:2]
    coordinates_left_wrist = pose_keypoints_2d[body_parts["LWrist"]][0:2]
    return 180 - angle_between(coordinates_left_shoulder - coordinates_left_elbow, coordinates_left_wrist - coordinates_left_elbow)

def compute_forearm_angle_right(pose_keypoints_2d, body_parts):
    coordinates_right_shoulder = pose_keypoints_2d[body_parts["RShoulder"]][0:2]
    coordinates_right_elbow = pose_keypoints_2d[body_parts["RElbow"]][0:2]
    coordinates_right_wrist = pose_keypoints_2d[body_parts["RWrist"]][0:2]
    return 180 - angle_between(coordinates_right_shoulder - coordinates_right_elbow, coordinates_right_wrist - coordinates_right_elbow)

def compute_back_angle(pose_keypoints_2d, body_parts):
    coordinates_mid_hip = pose_keypoints_2d[body_parts["MidHip"]][0:2]
    coordinates_vertical_point = (coordinates_mid_hip[0], coordinates_mid_hip[1] - 1)
    coordinates_neck = pose_keypoints_2d[body_parts["Neck"]][0:2]
    return angle_between(coordinates_vertical_point - coordinates_mid_hip, coordinates_neck - coordinates_mid_hip)

def compute_score_arm(compute_arm_angle):
    if  20 < compute_arm_angle < 45:
        return 2
    if 45 < compute_arm_angle < 90:
        return 3
    if compute_arm_angle > 90:
        return 4
    return 1

def compute_score_forearm(forearm_angle):
    return 1 if 60 <= forearm_angle <= 100 else 2

def compute_score_back(back_angle):
    if 0 <= back_angle <= 20:
        return 2
    if 20 <= back_angle <= 60:
        return 3
    if back_angle > 60:
        return 4
    return 0

def compute_final_score(pose_keypoints_2d):
    angle_arm_left = compute_arm_angle_left(pose_keypoints_2d, body_parts)
    angle_arm_right = compute_arm_angle_right(pose_keypoints_2d, body_parts)
    angle_forearm_left = compute_forearm_angle_left(pose_keypoints_2d, body_parts)
    angle_forearm_right = compute_forearm_angle_right(pose_keypoints_2d, body_parts)
    angle_back = compute_back_angle(pose_keypoints_2d, body_parts)

    score_rula = (compute_score_arm(angle_arm_left) + compute_score_arm(angle_arm_right))/2
    score_rula += (compute_score_forearm(angle_forearm_left) + compute_score_forearm(angle_forearm_right))/2
    score_rula += compute_score_back(angle_back)
    score_rula /= 3
    score_rula = 1 if score_rula > 2 else 0
    return score_rula