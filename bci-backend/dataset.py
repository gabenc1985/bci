#This class load datasets and save its in a EEGObject

import numpy as np
import h5py
import scipy.io
import utils
import EEGobject
import mne

class dataset:
    def __init__(self, work_directory):
        self.work_directory = work_directory
    
    def showWorkDirectory(self):
        print("Work directory : ", self.work_directory)

    def load_BCI_IV_2b(self):
        #Two clases of Motor Imagery: Left Hand and Rigth Hand

        raw = mne.io.read_raw_edf(self.work_directory, preload = True)
        sampling_frequency = raw.info["sfreq"]
        events = mne.find_events(raw, initial_event = True)
        label = []
        start_times = []
       
        for line in events:
            if(line[2] - line[1] == 769 or line[2] - line[1] == 770):
                # 769: event code of left hand
                # 770: event code of right hand
                start_times.append(float(line[0])/sampling_frequency + 0.5)
                label.append([1, 0] if line[2] - line[1] == 769 else [0, 1])
        C3 = np.asarray([])
        Cz = np.asarray([])
        C4 = np.asarray([])
        
        for time in start_times:
            # time != times
            # times is for plotting of raw data
            start = int(sampling_frequency * time)
            end = int(sampling_frequency * (time + 2.0))
            if end - start > 500:
                start += 1
            temp, _ = raw[:3, start:end] # _ is times
            C3 = np.asarray(C3.tolist() + np.asarray([temp[0]]).tolist())
            Cz = np.asarray(Cz.tolist() + np.asarray([temp[1]]).tolist())
            C4 = np.asarray(C4.tolist() + np.asarray([temp[2]]).tolist())
        data = np.asarray(np.asarray([C3]).tolist() + np.asarray([Cz]).tolist() + np.asarray([C4]).tolist())
        label = np.asarray(label)
        y = np.argmax(label, axis=1)
        # data.shape -> (# of channels (== 3), # of trials (== 120 or 160), # of signals(2(seconds) * 250(sampling_frequency) = 500)
        assert data.shape == (3, len(label), 500)
        data = data.swapaxes(1,0)
        eeg1 = EEGobject.EEGobject(data, y, sampling_frequency) #Create a EEG struct
        eeg1.setDescription('BCI Competition IV 2b') #Description of Data
        return eeg1
    
    def load_BCI_2008(self):
        #Four clases of Motor Imagery : Left hand, rigth hand, foot, tongue
        electrodes = 22
        fm = 250
        X, y = [], []        
        A01T = h5py.File(self.work_directory, 'r')
        X1 = np.copy(A01T['image'])
        X.append(X1[:, :electrodes, :])
        y1 = np.copy(A01T['type'])
        y1 = y1[0, 0:X1.shape[0]:1]
        y.append(np.asarray(y1, dtype=np.int32))
        X = np.asarray(X)
        y = np.asarray(y)

        y = y.swapaxes(1,0)

        X = np.reshape(X, (X.shape[1], X.shape[2], X.shape[3]))

        eeg1 = EEGobject.EEGobject(X, y, fm) #Create a EEG struct
        eeg1.setDescription('BCI Competition IIIa') #Description of Data
        return eeg1
    
    def load_BCI_Competition_IIIa(self):
        #Load data of BCI Competition IIIa
        directory = self.work_directory
        data = scipy.io.loadmat(directory)
        eeg = data['datos']
        signals = eeg['X']
        labels = eeg['Y']

        fm = 250
        X = np.asarray(signals[0][0])
        Y = np.asarray(labels[0][0])
    
        eeg1 = EEGobject.EEGobject(X, Y, fm) #Create a EEG struct
        eeg1.setDescription('BCI Competition IIIa') #Description of Data

        return eeg1
    
    def load_seven_shapes(self):
        #Seven clases of Visual Imagery

        directory = self.work_directory        

        data = scipy.io.loadmat(directory)
        datos = data['datos']
        signal = datos['X']
        labels = datos['Y']

        fm = 250
        X = np.asarray(signal[0][0])
        labels = np.asarray(labels[0][0])
        Y = np.transpose(labels)
                  
        Y = Y - 33025

        X = np.swapaxes(X, 1, 2)

        eeg1 = EEGobject.EEGobject(X, Y, fm) #Create a EEG struct
        eeg1.setDescription('Seven shapes') #Description of Data

        return eeg1
    
    def load_cercle_triangle(self):
        #Two clases of Visual Imagery : Cercle and Triangle

        directory = self.work_directory   

        fm = 250
        data = scipy.io.loadmat(directory)
        datos = data['datos']
        signal = datos['x_train']
        labels = datos['y_train']

        X = np.asarray(signal[0][0])
        labels = np.asarray(labels[0][0])
        Y = np.asarray(labels)
        Y = Y.T
        Y = Y - 33030

        X = X.swapaxes(1,2)
        X = X[:,:,:]
       
        eeg1 = EEGobject.EEGobject(X, Y, fm) #Create a EEG struct
        eeg1.setDescription('Cercle Triangle dataset') #Description of Data
        return eeg1
    
    def load_three_dog(self):
        directory = self.work_directory       
        data = scipy.io.loadmat(directory)
        datos = data['datos']
        signal = datos['x_train']
        labels = datos['y_train']

        fm = 250
        X = np.asarray(signal[0][0])
        labels = np.asarray(labels[0][0])
        Y = np.transpose(labels)
           
        Y = Y
        
        X = X.swapaxes(2,1)
        eeg1 = EEGobject.EEGobject(X, Y, fm) #Create a EEG struct
        eeg1.setDescription('VI three vs dog dataset') #Description of Data
        return eeg1
    
    def load_airplane_house(self):
        directory = self.work_directory   
      
        data = scipy.io.loadmat(directory)
        datos = data['datos']
        signal = datos['x_train']
        labels = datos['y_train']

        fm = 250
        X = np.asarray(signal[0][0])
        labels = np.asarray(labels[0][0])
        Y = np.transpose(labels)
           
        Y = Y
        print(X.shape)
        eeg1 = EEGobject.EEGobject(X, Y, fm) #Create a EEG struct
        eeg1.setDescription('VI airplane vs house dataset') #Description of Data
        return eeg1
    
    def load_12VI(self):
        fm = 1000
        directory = self.work_directory   
       
        data = scipy.io.loadmat(directory)
        datos = data['datos']
        signal = datos['x_train']
        labels = datos['y_train']
       
        X = np.asarray(signal[0][0])
        labels = np.asarray(labels[0][0])
        Y = np.transpose(labels)
            
        Y = Y - 1

        eeg1 = EEGobject.EEGobject(X, Y, fm) #Create a EEG struct
        eeg1.setDescription('VI airplane vs house dataset') #Description of Data
        return eeg1

    def load_12VP(self):
        fm = 1000
        directory = self.work_directory   
       
        data = scipy.io.loadmat(directory)
        datos = data['datos']
        signal = datos['x_train']
        labels = datos['y_train']
       
        X = np.asarray(signal[0][0])
        labels = np.asarray(labels[0][0])
        Y = np.transpose(labels)
            
        Y = Y - 1

        eeg1 = EEGobject.EEGobject(X, Y, fm) #Create a EEG struct
        eeg1.setDescription('Visual Perception 12 objects') #Description of Data
        return eeg1

    def load_motor_visual(self):
        fm = 250
        data = scipy.io.loadmat(self.work_directory)
        datos = data['datos']
        signal = datos['x_train']
        labels = datos['y_train']

        X = np.asarray(signal[0][0])
        labels = np.asarray(labels[0][0])
        Y = np.asarray(labels)

        X = np.swapaxes(X, 1, 2)
        eeg1 = EEGobject.EEGobject(X, Y, fm) #Create a EEG struct
        eeg1.setDescription('Motor vs Visual imagery') #Description of Data
        return eeg1

    def load_play_station(self):
        from sklearn.utils import shuffle
        fm = 250
        data = scipy.io.loadmat(self.work_directory)
        datos = data['datos']
        signal = datos['x_train']
        labels = datos['y_train']

        X = np.asarray(signal[0][0])
        labels = np.asarray(labels[0][0])
        Y = np.asarray(labels)
        
        Y = Y - 33025
        Y = Y.flatten()

        
        X = np.swapaxes(X, 1, 2)   
        #X, Y2  = shuffle(X, Y) 
       
        eeg1 = EEGobject.EEGobject(X, Y, fm) #Create a EEG struct
        eeg1.setDescription('Motor vs Visual imagery') #Description of Data
        return eeg1

    
    def load_Random(self, num_trials, num_channels, samples, num_clases, amplitude, fm):
        #This function create a EEGobject with random signals
        signals = []
        labels = []

        signals = np.zeros((num_trials, num_channels, samples)) #Create a matrix of signals
        for trial in range(num_trials):
            labels.extend([np.random.randint(0, num_clases)])
            for ch in range(num_channels):
                signals[trial, ch, :] = utils.generateRandomSignal(amplitude, samples)
        
        signals = np.asarray(signals)
        labels = np.asarray(labels)
        
        eeg1 = EEGobject.EEGobject(signals, labels, fm)

        return eeg1


        

