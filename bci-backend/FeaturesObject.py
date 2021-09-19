import numpy as np
import copy

class FeaturesObject:
    def __init__(self, features = None, labels = None):
        self.features = copy.deepcopy(features)
        self.labels = copy.deepcopy(labels)
        self.select_features = []
        self.csp = []
    
    
    def getFeatures(self):
        return self.features
    
    def getLabels(self):
        return self.labels
    
    def getSelectFeatures(self):
        return self.select_features

    def getCSP(self):
        return self.csp
    
    def setSelectedFeatures(self, features):
        self.select_features = features
    
    def setFeatures(self, features):
        self.features = copy.deepcopy(features)
    
    def setLabels(self, labels):
        self.labels = copy.deepcopy(labels)
    
    def setCSP(self, csp):
        self.csp = copy.deepcopy(csp)

    def show(self):
        print("Features : ", self.features.shape)
        print("Labels : ", np.unique(self.labels))
    
