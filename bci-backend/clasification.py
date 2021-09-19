import numpy as np
import copy
from sklearn.metrics import cohen_kappa_score
from sklearn.metrics import accuracy_score
from sklearn.metrics import precision_score
from sklearn.metrics import f1_score, mutual_info_score
from sklearn.metrics import classification_report, confusion_matrix



def create_SVM(type_kernel='rbf', x_train=[], y_train=[],):
    from sklearn import svm

    #Create a SVM classifier
    if not x_train == []:
        x_train = np.nan_to_num(x_train)
        clf = svm.SVC(kernel=type_kernel, C=8, gamma=0.5) #Usa gamma = 1/number features
        clf.fit(x_train, y_train)
    else:
        clf = svm.SVC(kernel=type_kernel, gamma='auto') #Usa gamma = 1/number features

    return clf

def create_LDA(x_train=[], y_train=[]):
    from sklearn.discriminant_analysis import LinearDiscriminantAnalysis

    #Create a SVM classifier
    if not x_train == []:
        x_train = np.nan_to_num(x_train)
        clf = LinearDiscriminantAnalysis()
        clf.fit(x_train, y_train)
    else:
        clf = LinearDiscriminantAnalysis()

    return clf

def create_KNN(k=1, x_train=[], y_train=[]):
    from sklearn.neighbors import KNeighborsClassifier

    #Create a SVM classifier
    if not x_train == []:
        x_train = np.nan_to_num(x_train)
        clf = KNeighborsClassifier(n_neighbors=k)
        clf.fit(x_train, y_train)
    else:
        clf = KNeighborsClassifier(n_neighbors=k)

    return clf


def create_RF(k=1, x_train=[], y_train=[]):
    from sklearn.ensemble import RandomForestClassifier

    #Create a SVM classifier
    if not x_train == []:
        x_train = np.nan_to_num(x_train)
        clf = RandomForestClassifier(max_depth=k, random_state=0)
        clf.fit(x_train, y_train)
    else:
        clf = RandomForestClassifier(max_depth=k, random_state=0)

    return clf

def create_XBOOST(learning_rate=0.05, n_estimators=500, x_train=[], y_train=[]):
    import xgboost as xgb

    #Create a SVM classifier
    if not x_train == []:
        x_train = np.nan_to_num(x_train)
        clf = xgb.XGBClassifier(seed= 0, #for reproducibility
                learning_rate= learning_rate,
                n_estimators= n_estimators)
        clf.fit(x_train, y_train)
    else:
        clf = xgb.XGBClassifier(seed= 0, #for reproducibility
                learning_rate= 0.05,
                n_estimators= 500)

    return clf



def k_fold_clasification(clf, x, y, k=5):
    from sklearn.model_selection import StratifiedKFold
    
    x = np.nan_to_num(x)
    num_clases = len(np.unique(y))

    array_acc = []
    kappa_t = 0
    cm_t = np.zeros((num_clases, num_clases))
    tpr_t = 0
    fpr_t = 0
   
    kf = StratifiedKFold(n_splits=k, random_state=42, shuffle=True)

    for train_index, test_index in kf.split(x, y):
        X_train, X_test = x[train_index], x[test_index]
        y_train, y_test = y[train_index], y[test_index]

        clf.fit(X_train, y_train)
        acc, kappa, tpr, fpr, cm = get_results(X_test, y_test, clf)

        array_acc.extend([acc])
        kappa_t += kappa
        tpr_t += tpr
        fpr_t += fpr
        cm_t += cm
    
    return np.mean(array_acc), np.std(array_acc), (kappa_t/k), (tpr_t/k), (fpr_t/k), (cm_t/k)

def k_fold_clasification_neural_networks(type_clf, x, y, batch, epochs, verbose=0, k=5):
    from sklearn.model_selection import StratifiedKFold
    from tensorflow.keras.utils import to_categorical
    from keras import backend as K
    import neural_networks
    
    x = np.nan_to_num(x)
    num_clases = len(np.unique(y))

    array_acc = []
    kappa_t = 0
    cm_t = np.zeros((num_clases, num_clases))
    tpr_t = 0
    fpr_t = 0
   
    kf = StratifiedKFold(n_splits=k, random_state=42, shuffle=True)

    for train_index, test_index in kf.split(x, y):
        X_train, X_test = x[train_index], x[test_index]
        y_train, y_test = y[train_index], y[test_index]

        y_train2 = to_categorical(y_train)   

        if type_clf == 'VANILLA_CNN1D':
            clf = neural_networks.vanilla_CNN1D(X_train.shape[1], X_train.shape[2], len(np.unique(y_train)))   

        clf.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])
        clf.fit(X_train, y_train2, batch_size=batch, epochs=epochs,verbose=verbose)
        acc, kappa, tpr, fpr, cm = get_results_nn(X_test, y_test, clf)

        array_acc.extend([acc])
        kappa_t += kappa
        tpr_t += tpr
        fpr_t += fpr
        cm_t += cm

        K.clear_session()
    
    return np.mean(array_acc), np.std(array_acc), (kappa_t/k), (tpr_t/k), (fpr_t/k), (cm_t/k)

def hold_on(clf, x_train, y_train, x_test, y_test, selected_features=[]):
    if not selected_features == []:
        x_train = x_train[:,selected_features]
        x_test = x_test[:,selected_features]

    x_train = np.nan_to_num(x_train)
    x_test = np.nan_to_num(x_test)

    clf.fit(x_train, y_train)
    acc, kappa, tpr, fpr, cm = get_results(x_test, y_test, clf)

    return acc, kappa, tpr, fpr, cm

def get_results(x_test, y_test, clf):
    x_test = np.nan_to_num(x_test)
  
    y_pred = clf.predict(x_test)
  

    kappa = cohen_kappa_score(y_test, y_pred)
    cm = confusion_matrix(y_test, y_pred, normalize='true')
    acc = accuracy_score(y_test, y_pred)*100

    FP = cm.sum(axis=0) - np.diag(cm)  
    FN = cm.sum(axis=1) - np.diag(cm)
    TP = np.diag(cm)
    TN = cm.sum() - (FP + FN + TP)

    FP = FP.astype(float)
    FN = FN.astype(float)
    TP = TP.astype(float)
    TN = TN.astype(float)

    # Sensitivity, hit rate, recall, or true positive rate
    TPR = TP/(TP+FN)
    # Specificity or true negative rate
    TNR = TN/(TN+FP) 
    # Precision or positive predictive value
    PPV = TP/(TP+FP)
    # Negative predictive value
    NPV = TN/(TN+FN)
    # Fall out or false positive rate
    FPR = FP/(FP+TN)
    # False negative rate
    FNR = FN/(TP+FN)
    # False discovery rate
    FDR = FP/(TP+FP)

    return acc, kappa, np.mean(TPR), np.mean(FPR), cm

def get_results_nn(x_test, y_test, clf):
    x_test = np.nan_to_num(x_test)
  
    y_pred = clf.predict(x_test)
    y_pred = np.argmax(y_pred, axis=1)
  

    kappa = cohen_kappa_score(y_test, y_pred)
    cm = confusion_matrix(y_test, y_pred, normalize='true')
    acc = accuracy_score(y_test, y_pred)*100

    FP = cm.sum(axis=0) - np.diag(cm)  
    FN = cm.sum(axis=1) - np.diag(cm)
    TP = np.diag(cm)
    TN = cm.sum() - (FP + FN + TP)

    FP = FP.astype(float)
    FN = FN.astype(float)
    TP = TP.astype(float)
    TN = TN.astype(float)

    # Sensitivity, hit rate, recall, or true positive rate
    TPR = TP/(TP+FN)
    # Specificity or true negative rate
    TNR = TN/(TN+FP) 
    # Precision or positive predictive value
    PPV = TP/(TP+FP)
    # Negative predictive value
    NPV = TN/(TN+FN)
    # Fall out or false positive rate
    FPR = FP/(FP+TN)
    # False negative rate
    FNR = FN/(TP+FN)
    # False discovery rate
    FDR = FP/(TP+FP)

    return acc, kappa, np.mean(TPR), np.mean(FPR), cm



