#This is a auxiliar class, contains functions and methods for create
#random signals and other type as filter, etc

import numpy as np
from scipy.signal import butter, welch, filtfilt, lfilter

  
def generateRandomSignal(amplitude, samples):
    y = 0
    signal = []
    x = np.linspace(0, samples, samples)

    for _ in x:
        signal.append(y)
        if not amplitude == 0:
            y += (np.random.normal(scale=1)/10)*amplitude
        else:
            y += (np.random.normal(scale=1)/10)
    
    result = np.array(signal)
    return result

def butter_bandpass(lowcut, highcut, fm, order=5):
    nyq = 0.5 * fm
    low = lowcut / nyq
    high = highcut / nyq
    b, a = butter(order, [low, high], btype='band')

    return b, a

def butter_lowpass(cutOff, fs, order=5):
    nyq = 0.5 * fs
    normalCutoff = cutOff / nyq
    b, a = butter(order, normalCutoff, btype='low', analog = False)
    return b, a

def butter_highpass(cutOff, fs, order=5):
    nyq = 0.5 * fs
    normalCutoff = cutOff / nyq
    b, a = butter(order, normalCutoff, btype='high', analog = False)
    return b, a

def averaging(trial, channel):
    sum_total = np.zeros(trial.shape[1])
    for ch in range(trial.shape[0]):
        if not ch == channel:
            sum_total += trial[ch, :]
    
    return (sum_total/trial.shape[0])

def calc_hjorth(x):
    first_deriv = np.diff(x)
    second_deriv= np.diff(x, 2)
    var_zero = np.mean(x**2)
    var_d1 = np.mean(first_deriv**2)
    var_d2 = np.mean(second_deriv**2)
    activity = var_zero
    mobility = np.sqrt(var_d1/var_zero)
    complexity = np.sqrt(var_d2/var_d1) / mobility

    return activity, mobility, complexity

def calc_statisticians(x):
    from scipy.stats import kurtosis

    mean = np.mean(x)
    maxi = np.max(x)
    mini = np.min(x)
    std = np.std(x)
    kurto = kurtosis(x)

    return mean, maxi, mini, std, kurto

def extract_first(s):
    res = ""
    i = 0
    while not s[i] == '-':
        res += s[i]
        i += 1
    
    return res

def extract_second(s):
    res = ""
    i = 0
    while not s[i] == '-':
        i += 1
    
    i += 1
    while i<len(s):
        res += s[i]
        i += 1
    
    return res




