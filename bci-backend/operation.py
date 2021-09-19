import numpy as np
from sklearn.model_selection import train_test_split
import copy
import EEGobject
import FeaturesObject
import ResultsObject
import dataset
import preprocessing
import features
import clasification

class operation:
    def __init__(self, type='', name = 0, params=[], inputs=[]):
       self.type = type
       self.inputs = inputs
       self.output = []
       self.params = params
       self.next_op = []
       self.join = 0  
       self.name = str(name)
       self.eeg_autotune_test = []
       self.execute_autotune = 0
    
    def setAutotuneTest(self, value):
        self.execute_autotune = value

    def setParams(self, params):      
        self.params = copy.deepcopy(params)        

    def setName(self, name):
        self.name = str(name)
    
    def getName(self):
        return self.name
    
    def getParams(self):
        return self.params

    def end(self):
        self.type = ''
        self.inputs = []
        self.output = []
        self.params = []
        self.next_op = []

    def getNext(self):
        return self.next_op

    def getType(self):
        return self.type

    def connection(self, pipe, op):
        self.next_op.append(op)
        pipe.addOperation(self)
        pipe.addEdge([self.name+op.getName()])
        return pipe

    def setInput(self, input, join = 0):      
        if join == 1:
            self.inputs.extend(copy.deepcopy(input))
        else:
            self.inputs = input
    
    def assignOutputs(self):        
        for i in range(0, len(self.next_op)):
            if len(self.output) == 1:
                self.next_op[i].setInput(self.output, self.join)
            else:
                #for j in range(0, len(self.output)):                
                self.next_op[i].setInput(self.output[i], self.join)
        
    def execute(self):
        if self.type == "EEG_IIIa":
            if self.execute_autotune == 1:
                self.output = []
            self.inputs = []
            subject = self.params[0]            
            work_directory = './db/bci_motor_imagery_iiia/'+str(subject)+'.mat'
            data1 = dataset.dataset(work_directory)
            eeg = data1.load_BCI_Competition_IIIa()
            tuner = self.params[1]
            if self.execute_autotune == 1:
                self.output.append(self.eeg_autotune_test)
                return self.output
            else:
                if tuner == 1:
                    x_train, x_test, y_train, y_test = train_test_split(eeg.getSignals(), eeg.getLabels(), test_size=0.25, random_state=42)
                    eeg.setSignals(x_train)
                    eeg.setLabels(y_train)
                    self.eeg_autotune_test = EEGobject.EEGobject(x_test, y_test, eeg.getFM())
                     

                self.output.append(eeg)
                return self.output

        if self.type == "EEG_MI2008":
            if self.execute_autotune == 1:
                self.output = []
            self.inputs = []
            subject = self.params[0]
            work_directory = './db/bci_motor_imagery2008/'+'A0' + str(subject) + 'T_slice.mat'
            data1 = dataset.dataset(work_directory)
            eeg = data1.load_BCI_2008()
            tuner = self.params[1]
            if self.execute_autotune == 1:
                self.output.append(self.eeg_autotune_test)
                return self.output
            else:
                if tuner == 1:
                    x_train, x_test, y_train, y_test = train_test_split(eeg.getSignals(), eeg.getLabels(), test_size=0.25, random_state=42)
                    eeg.setSignals(x_train)
                    eeg.setLabels(y_train)
                    self.eeg_autotune_test = EEGobject.EEGobject(x_test, y_test, eeg.getFM())
                           

                self.output.append(eeg)
                return self.output
        
        if self.type == "EEG_IV_2b":
            if self.execute_autotune == 1:
                self.output = []
            self.inputs = []
            subject = self.params[0]
            work_directory = './db/bci_motor_imagery_iv_2b/'+subject
            data1 = dataset.dataset(work_directory)
            eeg = data1.load_BCI_IV_2b()  
            tuner = self.params[1]
            if self.execute_autotune == 1:
                self.output.append(self.eeg_autotune_test)
                return self.output
            else:
                if tuner == 1:
                    x_train, x_test, y_train, y_test = train_test_split(eeg.getSignals(), eeg.getLabels(), test_size=0.25, random_state=42)
                    eeg.setSignals(x_train)
                    eeg.setLabels(y_train)
                    self.eeg_autotune_test = EEGobject.EEGobject(x_test, y_test, eeg.getFM())
                    
                self.output.append(eeg)
                return self.output

        if self.type == "EEG_seven_shapes":
            if self.execute_autotune == 1:
                self.output = []
            self.inputs = []
            subject = self.params[0]
            work_directory = './db/seven_shapes/S'+str(subject)+'.mat'
            data1 = dataset.dataset(work_directory)
            eeg = data1.load_seven_shapes()
            tuner = self.params[1]
            if self.execute_autotune == 1:
                self.output.append(self.eeg_autotune_test)
                return self.output
            else:
                if tuner == 1:
                    x_train, x_test, y_train, y_test = train_test_split(eeg.getSignals(), eeg.getLabels(), test_size=0.25, random_state=42)
                    eeg.setSignals(x_train)
                    eeg.setLabels(y_train)
                    self.eeg_autotune_test = EEGobject.EEGobject(x_test, y_test, eeg.getFM())      

            self.output.append(eeg)
            return self.output
        
        if self.type == "EEG_motor_visual":
            if self.execute_autotune == 1:
                self.output = []
            self.inputs = []
            subject = self.params[0]
            work_directory = './db/motor_visual/S'+str(subject)+'.mat'
            data1 = dataset.dataset(work_directory)
            eeg = data1.load_motor_visual()
            tuner = self.params[1]
            if self.execute_autotune == 1:
                self.output.append(self.eeg_autotune_test)
                return self.output
            else:
                if tuner == 1:
                    x_train, x_test, y_train, y_test = train_test_split(eeg.getSignals(), eeg.getLabels(), test_size=0.25, random_state=42)
                    eeg.setSignals(x_train)
                    eeg.setLabels(y_train)
                    self.eeg_autotune_test = EEGobject.EEGobject(x_test, y_test, eeg.getFM())      

            self.output.append(eeg)
            return self.output
        
        if self.type == "EEG_playstation":
            if self.execute_autotune == 1:
                self.output = []
            self.inputs = []
            subject = self.params[0]
            work_directory = 'C:/Users/Fabio/Desktop/Proyecto play station/Matlab/S'+str(subject)+'.mat' #'C:/Users/Fabio/Desktop/Proyecto play station/Matlab/S'+str(subject)+'.mat'
            data1 = dataset.dataset(work_directory)
            eeg = data1.load_play_station()
            tuner = self.params[1]
            if self.execute_autotune == 1:
                self.output.append(self.eeg_autotune_test)
                return self.output
            else:
                if tuner == 1:
                    x_train, x_test, y_train, y_test = train_test_split(eeg.getSignals(), eeg.getLabels(), test_size=0.25, random_state=42)
                    eeg.setSignals(x_train)
                    eeg.setLabels(y_train)
                    self.eeg_autotune_test = EEGobject.EEGobject(x_test, y_test, eeg.getFM())      

            self.output.append(eeg)
            return self.output
        
        if self.type == "EEG_Cercle_Triangle":
            if self.execute_autotune == 1:
                self.output = []
            self.inputs = []
            subject = self.params[0]
            work_directory = './db/cercle_triangle/S'+str(subject)+'.mat'
            data1 = dataset.dataset(work_directory)
            eeg = data1.load_cercle_triangle()
            tuner = self.params[1]
            if self.execute_autotune == 1:
                self.output.append(self.eeg_autotune_test)                
                return self.output
            else:
                if tuner == 1:
                    x_train, x_test, y_train, y_test = train_test_split(eeg.getSignals(), eeg.getLabels(), test_size=0.35, random_state=42)
                    eeg.setSignals(x_train)
                    eeg.setLabels(y_train)
                    self.eeg_autotune_test = EEGobject.EEGobject(x_test, y_test, eeg.getFM())          

                self.output.append(eeg)
                return self.output
        
        if self.type == "EEG_Three_Dog":
            if self.execute_autotune == 1:
                self.output = []
            self.inputs = []
            subject = self.params[0]
            work_directory = './db/arbol_perro/S'+str(subject)+'.mat'
            data1 = dataset.dataset(work_directory)
            eeg = data1.load_three_dog()
            print(eeg.show())
            tuner = self.params[1]
            if self.execute_autotune == 1:
                self.output.append(self.eeg_autotune_test)
                return self.output
            else:
                if tuner == 1:
                    x_train, x_test, y_train, y_test = train_test_split(eeg.getSignals(), eeg.getLabels(), test_size=0.25, random_state=42)
                    eeg.setSignals(x_train)
                    eeg.setLabels(y_train)
                    self.eeg_autotune_test = EEGobject.EEGobject(x_test, y_test, eeg.getFM())
                              

                self.output.append(eeg)
                return self.output
        
        if self.type == "EEG_12VI":
            if self.execute_autotune == 1:
                self.output = []
            self.inputs = []
            subject = self.params[0]
            work_directory = 'L:/DOCTORAT_BCI/Visual imagery and Perception Share Neural Representations in the Alpha frecuency Band/visual imagery/sujeto' + str(subject) + '/S0'+str(subject)+'.mat'
            data1 = dataset.dataset(work_directory)
            eeg = data1.load_12VI()
            self.output.append(eeg)
            return self.output
        
        if self.type == "EEG_12VP":
            if self.execute_autotune == 1:
                self.output = []
            self.inputs = []
            subject = self.params[0]   
            work_directory = 'L:/DOCTORAT_BCI/Visual imagery and Perception Share Neural Representations in the Alpha frecuency Band/datos_VP_mat/sujeto' + str(subject) + '/S0'+str(subject)+'.mat'
            data1 = dataset.dataset(work_directory)
            eeg = data1.load_12VP()
            self.output.append(eeg)
            return self.output
        
        if self.type == "EEG_Airplane_House":
            if self.execute_autotune == 1:
                self.output = []
            self.inputs = []
            subject = self.params[0]
            work_directory = './db/casa_avion/S'+str(subject)+'.mat'
            data1 = dataset.dataset(work_directory)
            eeg = data1.load_airplane_house()
            tuner = self.params[1]
            if self.execute_autotune == 1:
                self.output.append(self.eeg_autotune_test)
                print('Autotuner')
                return self.output
            else:
                if tuner == 1:
                    x_train, x_test, y_train, y_test = train_test_split(eeg.getSignals(), eeg.getLabels(), test_size=0.25, random_state=42)
                    eeg.setSignals(x_train)
                    eeg.setLabels(y_train)
                    self.eeg_autotune_test = EEGobject.EEGobject(x_test, y_test, eeg.getFM())          

                self.output.append(eeg)
                return self.output
        
        if self.type == "Select_channels":
            if self.execute_autotune == 1:
                self.output = []
            channels = self.params[0]
            eeg = self.inputs[0]
            eeg_output = preprocessing.select_channels(eeg, channels)
            self.output.append(eeg_output)        
            return self.output
        
        if self.type == "Select_clases":
            if self.execute_autotune == 1:
                self.output = []
            clases = self.params[0]            
            eeg = self.inputs[0]
            eeg_output = preprocessing.select_clases(eeg, clases)
            self.output.append(eeg_output)        
            return self.output
        
        if self.type == "BaselineVsTask":
            if self.execute_autotune == 1:
                self.output = []
            start_baseline = self.params[0]  
            end_baseline = self.params[1]
            start_task = self.params[2]
            end_task = self.params[3]

            eeg = self.inputs[0]
            eeg_output = preprocessing.baseline_vs_task(eeg, start_baseline, end_baseline, start_task, end_task)
            self.output.append(eeg_output)        
            return self.output

        if self.type == "Normalization":
            if self.execute_autotune == 1:
                self.output = []
            eeg = self.inputs[0]
            eeg_output = preprocessing.normalization(eeg)
            self.output.append(eeg_output)        
            return self.output
        
        if self.type == "Z_normalization":
            if self.execute_autotune == 1:
                self.output = []
            eeg = self.inputs[0]
            eeg_output = preprocessing.z_normalization(eeg)
            self.output.append(eeg_output)        
            return self.output
        
        if self.type == "Delete_DC":
            if self.execute_autotune == 1:
                self.output = []
            eeg = self.inputs[0]
            eeg_output = preprocessing.delete_DC(eeg)
            self.output.append(eeg_output)        
            return self.output
        
        if self.type == "Cut":      
            if self.execute_autotune == 1:
                self.output = []    
            start = self.params[0]
            end = self.params[1]
            size = self.params[2]
            overlap = self.params[3]
            eeg = self.inputs[0]         
            eeg_output = preprocessing.cut(eeg,start,end,size,overlap)
            self.output.append(eeg_output)   
            print(eeg_output.getSignals().shape)           
            return self.output
        
        if self.type == "bandpass":
            if self.execute_autotune == 1:
                self.output = []
            low = self.params[0]
            high = self.params[1]
            order = self.params[2]
            extended = self.params[3]
            eeg = self.inputs[0]
            eeg_output = preprocessing.butter_bandpass_filter(eeg, low, high, order, extended)
            self.output.append(eeg_output)  
            return self.output
        
        if self.type == "lowpass":
            if self.execute_autotune == 1:
                self.output = []
            low = self.params[0]    
            order = self.params[1]        
            extended = self.params[2]
            eeg = self.inputs[0]
            eeg_output = preprocessing.butter_lowpass_filter(eeg, low, order, extended)
            self.output.append(eeg_output)        
            return self.output
        
        if self.type == "highpass":
            if self.execute_autotune == 1:
                self.output = []
            low = self.params[0]    
            order = self.params[1]        
            extended = self.params[2]
            eeg = self.inputs[0]
            eeg_output = preprocessing.butter_highpass_filter(eeg, low, order, extended)
            self.output.append(eeg_output)        
            return self.output
        
        if self.type == "CAR":
            if self.execute_autotune == 1:
                self.output = []
            eeg = self.inputs[0]
            eeg_output = preprocessing.CAR_filter(eeg)
            self.output.append(eeg_output)        
            return self.output
        
        if self.type == "Select_trials":
            if self.execute_autotune == 1:
                self.output = []
            trials = self.params[0]
            eeg = self.inputs[0]
            eeg_output = preprocessing.select_trials(eeg, trials)
            self.output.append(eeg_output)        
            return self.output
        
        if self.type == "Concatenate":
            if self.execute_autotune == 1:
                self.output = []
            eeg = self.inputs[0]
            eeg_output = preprocessing.concatenar(self.inputs)
            self.output.append(eeg_output)        
            return self.output
        
        if self.type == "Split":
            self.join = 1
            if self.execute_autotune == 1:
                self.output = []
            p1 = self.params[0]
            p2 = self.params[1]
            eeg = self.inputs[0]
            eeg_output1, eeg_output2, eeg_output3 = preprocessing.split(eeg, p1, p2)
            self.output.append([eeg_output1])      
            self.output.append([eeg_output2])    
            if not eeg_output3 == []:
                self.output.append([eeg_output3])  
            print(self.output)
            return self.output
        
        if self.type == "Hjorth":
            if self.execute_autotune == 1:
                self.output = []
            activity = self.params[0]
            mobility = self.params[1]
            complexity = self.params[2]            
            eeg = self.inputs[0]
            eeg_output = features.hjorth(eeg, activity, mobility, complexity)
            self.output.append(eeg_output)    
            self.join = 1             
            return self.output
        
        if self.type == "Welch":
            if self.execute_autotune == 1:
                self.output = []
            intervalA = self.params[0]
            intervalB = self.params[1]
            average = self.params[2]
            nperseg = self.params[3]            
            eeg = self.inputs[0]
            eeg_output = features.welch(eeg, intervalA, intervalB, average, nperseg)
            self.output.append(eeg_output)    
            self.join = 1             
            return self.output
        
        if self.type == "FFT":
            if self.execute_autotune == 1:
                self.output = []
            intervalA = self.params[0]
            intervalB = self.params[1]
            average = self.params[2]         
            eeg = self.inputs[0]
            eeg_output = features.fft(eeg, intervalA, intervalB, average)
            self.output.append(eeg_output)    
            self.join = 1             
            return self.output
        
        if self.type == "SFFT":
            if self.execute_autotune == 1:
                self.output = []
            average = self.params[0]     
            eeg = self.inputs[0]
            eeg_output = features.sfft(eeg, average)
            self.output.append(eeg_output)    
            self.join = 1             
            return self.output
        
        if self.type == "Agregation":   
            if self.execute_autotune == 1:
                self.output = []
            eeg = self.inputs[0]
            eeg_output = features.aggregator(eeg, self.inputs)
            self.output.append(eeg_output) 
            return self.output
        
        if self.type == "Reasign":   
            if self.execute_autotune == 1:
                self.output = []
            eeg = self.inputs[0]
            params = self.params[0]
            eeg_output = preprocessing.reasign_clases(eeg, params[0])
            self.output.append(eeg_output) 
            return self.output
        
        if self.type == "CSP": 
            self.join = 1           
            if self.execute_autotune == 1:
                self.output = []           
            eeg = self.inputs[0]           
            n_components = self.params[0]
            eeg_output = features.CSP(eeg, n_components)
            self.output.append(eeg_output) 
            return self.output
        
        if self.type == "ApplyCSP":   
            if self.execute_autotune == 1:
                self.output = []         
            csp_features = self.inputs[2]  
            eeg = self.inputs[1]           
            n_components = self.params[0]
            eeg_output = features.ApplyCSP(eeg, csp_features)
            self.output.append(eeg_output) 
            return self.output
        
        if self.type == "Select_features":
            if self.execute_autotune == 1:
                self.output = []
            import search_features

            eeg = self.inputs[0]
            type_selection = self.params[0]
            clf_type = self.params[1]
            iterations = self.params[2]
            if clf_type == 'LDA':
                clf = clasification.create_LDA()
            elif clf_type == 'SVM-RBF':
                clf = clasification.create_SVM()
            elif clf_type == 'KNN':
                clf = clasification.create_KNN(self.params[3])
            
            eeg_output = search_features.getFeatures(eeg, clf, iterations, type_selection,0)
            self.output.append(eeg_output)
            return self.output            
        
        if self.type == "K_fold":        
            if self.execute_autotune == 1:
                self.output = []    
            if len(self.inputs) > 2:
                #Warning is a error search why fail
                eeg = self.inputs[len(self.inputs)-1]
            else:
                eeg = self.inputs[0]

            clf_type = self.params[0]
            k = self.params[1]
            if clf_type == 'LDA':
                clf = clasification.create_LDA()
            elif clf_type == 'SVM-RBF':
                clf = clasification.create_SVM()
            elif clf_type == 'KNN':
                clf = clasification.create_KNN(self.params[2])

            if type(eeg) == "EEGobject":
                acc, std, kappa, tpr, fpr, cm = clasification.k_fold_clasification(clf, eeg.getSignals(), eeg.getLabels(), k)
                res = ResultsObject.ResultsObject(acc, std, kappa, tpr, fpr, cm)
                self.output.append(res)
                return self.output
            else:              
                acc, std, kappa, tpr, fpr, cm =clasification.k_fold_clasification(clf, eeg.getFeatures(), eeg.getLabels(), k)
                res = ResultsObject.ResultsObject(acc, std, kappa, tpr, fpr, cm)
                self.output.append(res)
                return self.output
        
        if self.type == "Hold_on":       
            if self.execute_autotune == 1:
                self.output = []    
            if len(self.inputs) > 2:
                #Warning is a error search why fail
                eeg1 = self.inputs[len(self.inputs)-2]
                eeg2 = self.inputs[len(self.inputs)-1]
            else:
                eeg1 = self.inputs[0]
                eeg2 = self.inputs[1]

            clf_type = self.params[0]
           
            if clf_type == 'LDA':
                clf = clasification.create_LDA()
            elif clf_type == 'SVM-RBF':
                clf = clasification.create_SVM()
            elif clf_type == 'KNN':
                clf = clasification.create_KNN(self.params[2])

            if type(eeg1) == "EEGobject":
                acc, kappa, tpr, fpr, cm = clasification.hold_on(clf, 
                                                                     eeg1.getSignals(), eeg1.getLabels(),
                                                                     eeg2.getSignals(), eeg2.getLabels())
                res = ResultsObject.ResultsObject(acc, 0, kappa, tpr, fpr, cm)
                self.output.append(res)
                return self.output
            else:
                acc, kappa, tpr, fpr, cm =clasification.hold_on(clf, 
                                                                    eeg1.getFeatures(), eeg1.getLabels(), 
                                                                    eeg2.getFeatures(), eeg2.getLabels(),
                                                                    eeg1.getSelectFeatures())
                res = ResultsObject.ResultsObject(acc, 0, kappa, tpr, fpr, cm)
                self.output.append(res)
                return self.output
        

            
        
        

        
        
        