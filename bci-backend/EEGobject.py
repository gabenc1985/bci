#This class implement a EEG object and save information about it structure
#Author: Fabio R. Llorella Costa
#Data: 13/08/2021
#Version: 1.0

import numpy as np
import copy

class EEGobject:

    def __init__(self, signals = None, labels = None, fm = None):
        #The structure has this form: (Nº.Trial, Channels, Samples)
        if signals is None:
            self.signals = []
            self.channels = 0
            self.samples = 0
            self.fm = fm
            self.description = ""
            self.labels = []
        else:
            self.signals = copy.deepcopy(signals)
            self.channels = signals.shape[1]
            self.samples = signals.shape[2]
            self.fm = fm
            self.description = ""
            self.labels = labels
    
    def concat(self, eeg):
        if not self.signals == []:
            self.signals = np.concatenate((self.signals, eeg.getSignals()), axis=0)
            self.labels = np.concatenate((self.labels, eeg.getLabels()), axis=0)
            self.channels = self.signals.shape[1]
            self.samples = self.signals.shape[2]
            self.fm = eeg.getFM()
            self.description = 'Concatenate data'
            
        else:
            self.signals = eeg.getSignals().copy()
            self.labels = eeg.getLabels().copy()
            self.channels = self.signals.shape[1]
            self.samples = self.signals.shape[2]
            self.fm = eeg.getFM()
            self.description = 'Concatenate data'


    def getChannels(self):
        return self.channels
    
    def getSamples(self):
        return self.samples
    
    def getNumTrials(self):
        return len(self.signals)
    
    def getSignals(self):
        return self.signals

    def getFM(self):
        return self.fm
    
    def getDescription(self):
        return self.description
    
    def getLabels(self):
        return self.labels.flatten()
    
    def getSignalData(self, row, channel):
        return self.signals[row, channel, :]

    def setSignals(self, signals):
        self.signals = copy.deepcopy(signals)
        self.channels = signals.shape[1]
        self.samples = signals.shape[2]
    
    def setLabels(self, labels):
        self.labels = labels.copy()
    
    def setDescription(self, description):
        self.description = description
    
    def show(self):
        print("Shape : ", self.signals.shape)
        print("Labels : ", np.unique(self.labels))

    def concatenate(self, EEGobject1):
        #This method concatenate EEGObject1 with self object and save in self object
        self.signals = np.concatenate((self.signals, EEGobject1.getSignals()), axis = 0)
        self.labels = np.concatenate((self.labels, EEGobject1.getLabels()), axis = 0)
    
    def select_channels(self, channels):
        if len(channels) <= self.channels:
            self.signals = self.signals[:, channels, :]
            self.channels = len(channels)
            return 1
        else:
            return -1
    
    def select_trials(self, array_trials):
        try:
            self.signals = self.signals[array_trials, : , :].copy()
        except:
            return -1
    