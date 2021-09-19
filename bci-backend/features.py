import numpy as np
import copy
import utils
import EEGobject
import FeaturesObject


def hjorth(EEG, act=1, mob=1, compl=1):  
    features = []
    signals = EEG.getSignals()
    for trial in signals:
        feature = []
        for ch in range(EEG.getChannels()):
            array_features = []
            segment = trial[ch, :]
            activity, mobility, complexity = utils.calc_hjorth(segment)
            if act == 1:
                array_features.extend([activity])
            if mob == 1:
                array_features.extend([mobility])
            if compl == 1:
                array_features.extend([complexity])

            feature.extend(array_features)

        features.append(feature)

    features = np.asarray(features) 
    EEG = FeaturesObject.FeaturesObject(features, EEG.getLabels())
    return EEG

def statisticians(EEG, meanP=1, stdP=1, maxiP=1, miniP=1, kurtosisP=1):   
    features = []
    signals = EEG.getSignals()
    for trial in signals:
        feature = []
        for ch in range(EEG.getChannels()):
            array_features = []
            segment = trial[ch, :]
            mean, maxi, mini, std, kurto = utils.calc_statisticians(segment)
            if meanP == 1:
                array_features.extend([mean])
            if stdP == 1:
                array_features.extend([std])
            if maxiP == 1:
                array_features.extend([maxi])
            if miniP == 1:
                array_features.extend([mini])
            if kurtosisP == 1:
                array_features.extend([kurto])

            feature.extend(array_features)

        features.append(feature)

    features = np.asarray(features) 
    EEG = FeaturesObject.FeaturesObject(features, EEG.getLabels())
    return EEG

def fft(EEG, intervalA, intervalB, average=0):
        from scipy.fft import rfft
        
        N = EEG.getSamples() #duration

        features = []
        signals = EEG.getSignals()
        for trial in signals:
            feature = []
            for ch in range(EEG.getChannels()):
                segment = trial[ch, :]
                yf = rfft(segment)   
                if average == 1:
                    y = np.mean(np.abs(yf)) 
                    feature.extend([y]) 
                else:          
                    y = np.abs(yf)
                    feature.extend(y[intervalA:intervalB])

            features.append(feature)

        features = np.asarray(features) 
        EEG = FeaturesObject.FeaturesObject(features, EEG.getLabels())
        return EEG

def sfft(EEG, average=1):
        from scipy import signal

        features = []
        signals = EEG.getSignals()
        for trial in signals:
            feature = []
            for ch in range(EEG.getChannels()):
                segment = trial[ch, :]
                frequency, time, spec = signal.stft(x = segment, fs = EEG.getFM(), nperseg = EEG.getFM())
                if average == 1:                
                    feature.extend([np.mean(np.abs(spec))]) 
                else:          
                    feature.extend(np.abs(spec))

            features.append(feature)

        features = np.asarray(features) 
        EEG = FeaturesObject.FeaturesObject(features, EEG.getLabels())
        return EEG
    

def welch(EEG, intervalA, intervalB, average = 0, nperseg = 250):
        from scipy import signal
        
        fs = EEG.getFM()

        features = []
        signals = EEG.getSignals()
        for trial in signals:
            feature = []
            for ch in range(EEG.getChannels()):
                segment = trial[ch, :]
                f, Pxx_den = signal.welch(segment, fs, nperseg=nperseg)    
                if average == 1:
                    feature.extend([np.mean(Pxx_den)])
                else:     
                    feature.extend(Pxx_den[intervalA:intervalB])

            features.append(feature)

        features = np.asarray(features)
        EEG = FeaturesObject.FeaturesObject(features, EEG.getLabels())
        return EEG
    
def CSP(EEG, n_components):
    from mne.decoding import CSP

    if isinstance(EEG, EEGobject.EEGobject):
        print('EEG create CSP')
        csp = CSP(n_components=n_components, reg=None, log=True, norm_trace=False)

        signals = EEG.getSignals()
        labels = EEG.getLabels()

        signals = np.nan_to_num(signals)
        csp.fit_transform(signals, labels)
        csp = copy.deepcopy(csp)
        features_cps = csp.transform(signals)
        EEG = FeaturesObject.FeaturesObject(features_cps, EEG.getLabels())
        EEG.setCSP(csp)

        return EEG
    else:
       pass

def ApplyCSP(EEG, csp):
    print('Apply CSP')
    signals = EEG.getSignals()
    csp_feat = csp.getCSP()
    features_cps = csp_feat.transform(signals)
    EEG = FeaturesObject.FeaturesObject(features_cps, EEG.getLabels())
    EEG.setCSP([])

    return EEG



    
def aggregator(EEG, features_array):
        #This function joint two o more features
        #in a one feature vector
        dimension = 0
        for f in features_array:
            f1 = f.getFeatures()
            dimension += f1.shape[1]
        
        faux = features_array[0]
        result = faux.getFeatures()

        for pos in range(1, len(features_array)):           
            f = features_array[pos]
            fsignals = f.getFeatures()
            result = np.concatenate((result, fsignals), axis=1)

        features = np.asarray(result)
        features = np.asarray(features)
        EEG = FeaturesObject.FeaturesObject(features, EEG.getLabels())
        return EEG
