import numpy as np
import copy
import utils
import EEGobject


def select_clases(EEG, clases):
    #This function select only the classes contains in clases   
    signals = EEG.getSignals()
    labels = EEG.getLabels()
    new_signals = []
    new_labels = []
    
    for s,l in zip(signals, labels):
        if l in clases:
            new_labels.extend([l])
            new_signals.append(s)
    
    new_signals = np.asarray(new_signals)
    new_labels = np.asarray(new_labels)
    EEG.setSignals(new_signals)
    EEG.setLabels(new_labels)

    return EEG

def reasign_clases(EEG, dic):  
    labels = EEG.getLabels()

    for i in range(0, len(labels)):
        labels[i] = dic[str(labels[i])]

    EEG.setLabels(labels) 
    return EEG
        


def normalization(EEG):
        #Function to normalization signals
        
        signals = EEG.getSignals()

        for i in range(EEG.getNumTrials()):
            for ch in range(EEG.getChannels()):              
                channel = signals[i, ch, :]
                signals[i, ch, :] = (channel - np.min(channel)) / (np.max(channel) - np.min(channel))
        
        EEG.setSignals(signals)
        return EEG
      

def z_normalization(EEG):
    try:
        signals = EEG.getSignals()

        for i in range(EEG.getNumTrials()):
            for ch in range(EEG.getChannels()):
                channel = signals[i, ch, :]
                signals[i, ch, :] = (channel - np.mean(channel)) / (np.std(channel))
        
        EEG.setSignals(signals)
        return EEG
    except:
        return -1

def delete_DC(EEG):
        #This function delete the base line of the all channels
        try:
            signals = EEG.getSignals()
            for i in range(EEG.getNumTrials()):
                for ch in range(EEG.getChannels()):
                    channel = signals[i, ch, :]
                    signals[i, ch, :] = channel - np.mean(channel)
            
            EEG.setSignals(signals)

            return EEG
        except:
            return -1

def select_channels(EEG, channels):
        #This method select channels
        result = EEG.select_channels(channels)
        return copy.deepcopy(EEG)

def cut(EEG, start_cut, end_cut, size_segments, overlap):
    #This function cut the trials    
    results = []
    labels_result = []
    signals = EEG.getSignals()        
    labels = EEG.getLabels()      
    for trial, label in zip(signals, labels):
        start_chunk = int(start_cut*EEG.getFM())
        end_chunk = start_chunk + int(size_segments*EEG.getFM())
        while end_chunk <= (end_cut*EEG.getFM()):          
            chunk = trial[:, start_chunk:end_chunk]
            results.append(chunk)
            labels_result.extend([label])

            start_chunk = end_chunk - int(overlap*EEG.getFM())
            end_chunk = start_chunk + int(size_segments*EEG.getFM())

    results = np.asarray(results)
    labels_result = np.asarray(labels_result)
    
    EEG.setSignals(results)
    EEG.setLabels(labels_result)

    return EEG

def getChunk(EEG, start_chunk, end_chunk):
    signals = EEG.getSignals()
    signals = signals[:,:,start_chunk:end_chunk]
    EEG.setSignals(signals)

    return EEG

def butter_bandpass_filter(EEG, low, high, order, extended = 1):
    from scipy.signal import butter, welch, filtfilt, lfilter
    from matplotlib import pyplot as plt

    #This function create a band pass filter 

    
    b, a =  utils.butter_bandpass(low, high, EEG.getFM(), order)
    signals = EEG.getSignals()
    for i in range(EEG.getNumTrials()):
        for ch in range(EEG.getChannels()):
            channel = signals[i, ch, :]
            if extended == 1:
                channel = np.concatenate((channel, channel))

            y = lfilter(b, a, channel)
            
            y = y[0:EEG.getSamples()]
            signals[i, ch, :] = y

    EEG.setSignals(signals)
    return EEG 

def butter_lowpass_filter(EEG, cutOff, order, extended = 1):
    from scipy.signal import butter, welch, filtfilt, lfilter
    from matplotlib import pyplot as plt

    #This function create a band pass filter 

    try:
        b, a =  utils.butter_lowpass(cutOff, EEG.getFM(), order)
        signals = EEG.getSignals()
        for i in range(EEG.getNumTrials()):
            for ch in range(EEG.getChannels()):
                channel = signals[i, ch, :]
                if extended == 1:
                    channel = np.concatenate((channel, channel))

                y = lfilter(b, a, channel)
                y = y[0:EEG.getSamples()]
                signals[i, ch, :] = y

        EEG.setSignals(signals)
        return EEG
    except:
        return -1  

def butter_highpass_filter(EEG, cutOff, order, extended = 1):
        from scipy.signal import butter, welch, filtfilt, lfilter
        from matplotlib import pyplot as plt

        #This function create a band pass filter 

        try:
            b, a =  utils.butter_highpass(cutOff, EEG.getFM(), order)
            signals = EEG.getSignals()
            for i in range(EEG.getNumTrials()):
                for ch in range(EEG.getChannels()):
                    channel = signals[i, ch, :]
                    if extended == 1:
                        channel = np.concatenate((channel, channel))

                    y = lfilter(b, a, channel)
                    y = y[0:EEG.getSamples()]
                    signals[i, ch, :] = y

            EEG.setSignals(signals)
            return EEG
        except:
            return -1 

def CAR_filter(EEG):
    #This function implements a Common Average Reference filter

    try:
        new_signals = np.zeros((EEG.getNumTrials(), 
                            EEG.getChannels(), EEG.getSamples()))
        
        signals = EEG.getSignals()

        for position in range(0, EEG.getNumTrials()):
            trial = signals[position]
            for ch in range(EEG.getChannels()):
                channel = trial[ch, :]
                average = utils.averaging(trial, ch)
                channel_CAR = channel - average
                new_signals[position, ch, :] = channel_CAR
        
        EEG.setSignals(new_signals)
        return EEG
    except:
        return -1

def select_trials(EEG, array_trials):
    #This function select the trials that mark array_trials
    try:            
        return EEG.select_trials(array_trials)
    except:
        return -1

def concatenar(array_eeg):
    try:
        eer = EEGobject.EEGobject() #Empty object

        for eeg in array_eeg:
            eer.concat(eeg)
        
        EEG = copy.deepcopy(eer)
        return EEG
    except:
        return -1

def baseline_vs_task(EEG, start_baseline, end_baseline, start_task, end_task):
    signals = EEG.getSignals()

    baseline = signals[:,:,start_baseline:end_baseline]
    task = signals[:,:,start_task:end_task]

    x = np.concatenate((baseline, task), axis=0)

    labels = np.concatenate((np.zeros(len(baseline), dtype=int), np.ones(len(task), dtype=int)),axis=0)

    eeg = EEGobject.EEGobject(x, labels, EEG.getFM())
    return eeg
    
def split(EEG, percentage_val, percentage_test=0):
    #Separate de EEGobject in 3 groups: Train, Validation, Test
    from sklearn.model_selection import train_test_split

    
    signals = EEG.getSignals()
    labels = EEG.getLabels()

    if not percentage_test == 0:
        x_train, x_val, y_train, y_val = train_test_split(signals, 
                                        labels, test_size=percentage_test, random_state=42)
        
        x_train, x_test, y_train, y_test = train_test_split(x_train, y_train, 
                                        test_size=percentage_val, random_state=42)

        
        eeg_train = EEGobject.EEGobject(x_train, y_train, EEG.getFM())
        eeg_val = EEGobject.EEGobject(x_val, y_val, EEG.getFM())
        eeg_test = EEGobject.EEGobject(x_test, y_test, EEG.getFM())

        return eeg_train, eeg_val, eeg_test
    else:
        x_train, x_val, y_train, y_val = train_test_split(signals, 
                                        labels, test_size=percentage_val, random_state=42)
        
        eeg_train = EEGobject.EEGobject(x_train, y_train, EEG.getFM())
        eeg_val = EEGobject.EEGobject(x_val, y_val, EEG.getFM())

        return eeg_train, eeg_val, []
  