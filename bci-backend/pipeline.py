from types import CodeType
import numpy as np
import os
import graphviz
import copy
import utils
import operation

class pipeline:
    def __init__(self):
        self.operations = []
        self.output = []
        self.end_pipe = []    
        self.edges = []
        self.conter = 0
        self.connections = []
            
    def createPipe(self, operations, connections):
        self.connections = connections
        diccionario = {}
        for op in operations:        
            aux = operation.operation(op['type'], op['id'], op['params'])
            diccionario.update({op['id']:aux})            
            self.operations.append(aux)
        
        self.end_pipe.append(aux)
        for elem in connections:
            first_id = utils.extract_first(elem)
            second_id = utils.extract_second(elem)

            aux = diccionario.get(first_id)
            aux2 = diccionario.get(second_id)
            

            self = aux.connection(self, aux2)      

    def addEdge(self, edge):
        self.edges.extend(edge)

    def addOperation(self, op):
        if not op in self.operations:
            op.setName(self.conter)
            self.conter += 1
            self.operations.append(op)
    
    def addEnd(self, op):
        if not op in self.operations:
            self.operations.append(op)
        self.end_pipe.append(op)
    
    def execute(self):
        for op in self.operations:
            print("[+]- ", op.getType())
            eeg = op.execute()
            op.assignOutputs()
            if not eeg == None:       
                if op in self.end_pipe:         
                    self.output.append(copy.deepcopy(eeg))
        return self.output
    

    def show_graph(self):
        os.environ["PATH"] += os.pathsep + 'C:/Program Files (x86)/Graphviz2.38/bin/'
        dot = graphviz.Digraph(comment='BCI Pipeline')
        dot.attr('node', shape='box')
    
        i = 0      
        idnode = str(i) 
        for op in self.operations:           
            dot.node(idnode, op.getType())
            i += 1
            idnode = str(i)

        i = 0   
        idnode = str(i)

        for elem in self.connections:
            first_id = utils.extract_first(elem)
            second_id = utils.extract_second(elem)
            dot.edge(first_id, second_id)

        #dot.edges(self.edges)
        dot.render('test-output/round-table.gv', view=True)  


    def end(self):
        for op in self.operations:
            op.end()
        
        del(self)
    
    def search_operation(self, id_op): 
        i = 0      
        for op in self.operations:
            if op.getName() == id_op:
                return i
            i += 1
        
        return -1

    def show_pipeline(self):       
        for op in self.operations:
            print('-> ' + op.getType() + str(op.getParams()))

    def auto_tune(self, autotune_params):    
        #Esta funcion esta mal, se debe reescribir toda
        #Debemos realizar todas las combinaciones posibles
        #Ahora mismo no lo hace
          
        copy_pipe = copy.deepcopy(self)
        maximo = -1
        m_acc = 0
        m_kappa = 0
        m_std = 0
        m_cm = 0
        m_comb = []

        for elem in autotune_params:
            index = self.search_operation(elem['id'])
            combinations = elem['combinations']
            for comb in combinations:
                '''os.system('cls')
                print(comb)
                print('Acc : ' + str(m_acc) + ' +/- ' + str(m_std))
                print('Kappa : ', m_kappa)
                print('Comb :', m_comb)
                print('')
                print(m_cm)
                print('Combinacion : ', comb)'''                     
                self.operations[index].setParams(comb)
                output = self.execute() #Ejecutamos la pipe
                aux = copy.deepcopy(self)
                self = copy.deepcopy(copy_pipe)
                acc, kappa, std, cm = output[0][0].getResults()  
                if kappa > maximo:
                    maximo = kappa
                    mejor_pipe = copy.deepcopy(aux)
                    m_acc = acc
                    m_kappa = kappa
                    m_std = std
                    m_cm = cm     
                    m_comb = comb            

        return mejor_pipe, m_acc, m_std, m_kappa, m_cm, m_comb
    
    def execute_autotune_test(self):
        for i in range(0, len(self.operations)):
            self.operations[i].setAutotuneTest(1)
            i += 1
        return self.execute()

                

        
    