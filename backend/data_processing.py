import pandas as pd
import os
from sklearn import datasets

paths = {
    'housing': r'/home/cedric-cavents/.cache/kagglehub/datasets/yasserh/housing-prices-dataset/versions/1',
    'covid': r'/home/cedric-cavents/.cache/kagglehub/datasets/khushikyad001/covid-19-reinfection-and-health-dataset/versions/1',
    "weather": r"/home/cedric-cavents/.cache/kagglehub/datasets/muthuj7/weather-dataset/versions/1"
}

def housing_data():
    df = pd.read_csv(os.path.join(paths['housing'], 'Housing.csv'))
    cols_to_convert = ['price', 'area', 'bedrooms', 'bathrooms', 'stories', 'parking']
    df[cols_to_convert].apply(pd.to_numeric)
    return df.sort_values(by='area').reset_index(drop=True)

def covid_data():
    df = pd.read_csv(os.path.join(paths['covid'], 'covid_related_disease_data.csv'))
    return df

def iris_data():
    data = datasets.load_iris()
    df = pd.DataFrame(data['data'], columns=data['feature_names'])
    y = (data['target'] == 2).astype(int)
    df = pd.concat([pd.DataFrame(y, columns=['virginica']), df], axis=1)
    return df

def weather_data():
    df = pd.read_csv(os.path.join(paths['weather'], 'weatherHistory.csv'))
    return df

dfs = {
    'housing': housing_data(),
    'covid': covid_data(),
    'iris': iris_data(),
    'weather': weather_data()
}


