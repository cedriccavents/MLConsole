from flask import Blueprint, request, jsonify
import json
import pandas as pd

from data_processing import dfs
from training import Regression, PreProcess

data_blueprint = Blueprint('data_blueprint', __name__)

@data_blueprint.route('/api/data/<name>', methods=['GET'])
def get_data(name):
    return dfs[name].to_json(orient='records')

@data_blueprint.route('/api/correlations/<name>/<feature>')
def get_correlations(name, feature):
    p = PreProcess()
    X, y = p.transform(dfs[name], [feature])
    rho = pd.concat([y, X], axis=1).corr()
    return rho[feature].round(2).to_dict()

@data_blueprint.route('/api/models/<name>', methods=['GET'])
def get_model_name(name):
    with open("../static/models.json") as f:
         models = json.load(f)
    return models[name]

@data_blueprint.route('/api/models/<name>/<subname>', methods=['GET'])
def get_model_subname(name, subname):
    with open("../static/models.json") as f:
         models = json.load(f)
    return models[name][subname]

@data_blueprint.route('/api/variables', methods=['POST'])
def train_model():
    data = request.get_json()
    features = data['features']
    features.remove(data['target'])
    print(data)
    # create instance of modelling class
    try:
        model = Regression([data['target']], features, data['modeltype'])
        model.set_model(data['model'])
        # model.set_model('Logistic')
        if data['model'] == 'Dummy':
            model.set_model('Dummy', strategy=data['strategy'].lower())
        if data['model'] in ['Ridge', 'Lasso']:
            model.set_model(data['model'], alpha=float(data['alpha']))
        if data['model'] == 'Polynomial':
            model.set_parameters(int(data['Degree']))
        if data['model'] == 'DecisionTree':
            model.set_model(
                data['model'],
                max_depth=int(data['max depth']),
                criterion=data['criterion'],
                max_features=int(data['max features']),
                max_leaf_nodes=int(data['max leaf nodes'])
            )
        if data['model'] == 'RandomForest':
            model.set_model(
                data['model'],
                n_estimators=int(data['# estimators']),
                criterion=data['criterion'],
                max_features=int(data['max features']),
                max_depth = data['max depth']
            )

        if data['model'] in ['AdaBoost', 'GradientBoost']:
            model.set_model(
                data['model'],
                n_estimators=int(data['# estimators']),
                learning_rate=float(data['learning rate']),
            )
        # run model
        results = model.pipeline(dfs[data['data']])
    except:
        raise NotImplementedError

    return jsonify(results)