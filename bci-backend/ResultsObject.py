from matplotlib import pyplot as plt
import seaborn as sn
import numpy as np
import copy


class ResultsObject:
    def __init__(self, acc, std, kappa, tpr, fpr, cm):
        self.acc = acc
        self.std = std
        self.kappa = kappa
        self.tpr = tpr
        self.fpr = fpr
        self.cm = cm
    
    def show(self):
        print('')
        print('Results')
        print('Acc : ' + str(self.acc) + ' +/- ' + str(self.std))
        print('Kappa : ', self.kappa)
        print(self.cm)
        sn.heatmap(self.cm, annot=True)
        plt.show()
    
    def getResults(self):
        return self.acc, self.kappa, self.std, self.cm