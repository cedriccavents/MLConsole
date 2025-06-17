from typing import Any
import numpy as np
import pandas as pd
from pandas.api.types import is_string_dtype, is_numeric_dtype
from scipy.stats import pointbiserialr
from sklearn.base import TransformerMixin, BaseEstimator
from sklearn.compose import ColumnTransformer
from sklearn.dummy import DummyClassifier
from sklearn.ensemble import RandomForestClassifier, AdaBoostClassifier, GradientBoostingClassifier
from sklearn.linear_model import LinearRegression, Ridge, Lasso, LogisticRegression
from sklearn.metrics import (
    r2_score,
    mean_squared_error,
    accuracy_score,
    f1_score,
    precision_score,
    recall_score,
    precision_recall_curve,
    make_scorer
)
from sklearn.model_selection import train_test_split, RandomizedSearchCV, TunedThresholdClassifierCV
from sklearn.tree import DecisionTreeRegressor, DecisionTreeClassifier
from sklearn.svm import SVC
from sklearn.preprocessing import PolynomialFeatures, OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
import shap

from data_processing import dfs
from app.utils import default
df = dfs['iris']
types = df.dtypes.to_dict()

class BinaryEncoder(BaseEstimator, TransformerMixin):
    def fit(self, X, y=None):
        return self
    def transform(self, X):
        for feature in X.columns:
            vals = X[feature].unique()
            X[feature] = np.where(X[feature] == vals[0], 1, 0)
        return X
    def get_feature_names_out(self, X, y=None):
        return X

class PreProcess:
    @staticmethod
    def transform(df, target):
        # set target and features
        y = df[target]
        X = df.drop(target, axis=1)

        # categorical features
        binary_features = [feature for feature in X.columns if len(X[feature].unique()) == 2]
        categorical_features = [feature for feature in X.columns if is_string_dtype(X[feature])]
        categorical_features = list(set(categorical_features) - set(binary_features))
        numerical_features = [feature for feature in X.columns if is_numeric_dtype(X[feature])]

        # feature transformers
        transformer = ColumnTransformer(
            [
                ('onehotencoder', OneHotEncoder(), categorical_features),
                ('StandardScaler', StandardScaler(), numerical_features),
                ('BinaryEncoder', BinaryEncoder(), binary_features),
            ]
        )

        data_pipeline = Pipeline([
            ('preprocessing', transformer),
        ])

        X_tr = data_pipeline.fit_transform(X)
        cols = [x.split("__")[1] for x in transformer.get_feature_names_out().tolist()]
        X_tr = pd.DataFrame(X_tr, columns=cols)

        # target transformer (only for classification)
        if is_string_dtype(y.iloc[:, 0]):
            target_pipeline = Pipeline([
                ('BinaryEncoder', BinaryEncoder())
            ])
            y = target_pipeline.fit_transform(y)

        return X_tr, y

class Regression:
    def __init__(self, target, features, model_class):
        self.target = target
        self.features = features
        self.model_class = model_class

    def set_model(self, model, **args) -> None:
        match model:
            case 'Linear': self.modelObject = LinearRegression()
            case 'Ridge': self.modelObject = Ridge(**args)
            case 'Lasso': self.modelObject = Lasso(**args)
            case 'Polynomial': self.modelObject = LinearRegression()
            case 'DecisionTree': self.modelObject = DecisionTreeRegressor(**args) \
                if self.model_class == 'Regression' else DecisionTreeClassifier()
            case 'Logistic': self.modelObject = LogisticRegression(**args)
            case "SVC": self.modelObject = SVC(probability=True),
            case "RandomForest": self.modelObject = RandomForestClassifier(),
            case "AdaBoost": self.modelObject = AdaBoostClassifier(DecisionTreeClassifier(max_depth=10), **args),
            case "GradientBoost": self.modelObject = GradientBoostingClassifier(**args),
            case "Dummy": self.modelObject = DummyClassifier(**args)

        if isinstance(self.modelObject, tuple):
            self.modelObject = self.modelObject[0]

        self.model = model

    def set_parameters(self, *args):
        self.parameters = args

    def transform(self, df) -> None:
        # set target and features
        y = df[self.target]
        X = df[self.features]

        # categorical features
        binary_features = [feature for feature in X.columns if len(X[feature].unique()) == 2]
        categorical_features = [feature for feature in X.columns if is_string_dtype(X[feature])]
        categorical_features = list(set(categorical_features) - set(binary_features))
        numerical_features = [feature for feature in X.columns if is_numeric_dtype(X[feature])]

        # feature transformers
        transformer = ColumnTransformer(
            [
                ('onehotencoder', OneHotEncoder(), categorical_features),
                ('StandardScaler', StandardScaler(), numerical_features),
                ('BinaryEncoder', BinaryEncoder(), binary_features),
            ]
        )

        data_pipeline = Pipeline([
            ('preprocessing', transformer),
        ])

        X_tr = data_pipeline.fit_transform(X)
        cols = [x.split("__")[1] for x in transformer.get_feature_names_out().tolist()]
        self.X = pd.DataFrame(X_tr, columns=cols)

        # target transformer (only for classification)
        if is_string_dtype(y.iloc[:, 0]):
            target_pipeline = Pipeline([
                ('BinaryEncoder', BinaryEncoder())
            ])
            self.y = target_pipeline.fit_transform(y)
        else:
            self.y = y

        # correlation
        self.rho = pd.concat([self.y, self.X], axis=1).corr()

    def results(self, fitted_model, X_train, X_test, y_train, y_test):
        results = {}

        if self.model_class == 'Regression':
            # performance metric for regression
            y_pred_train = fitted_model.predict(X_train)
            y_pred_test = fitted_model.predict(X_test)
            residuals = np.array(y_train.iloc[:, 0]) - y_pred_train
            results.update({
                'rsq_train': round(r2_score(y_train, y_pred_train), 3),
                'rsq_test': round(r2_score(y_test, y_pred_test), 3),
                'residuals': residuals/np.std(residuals)
            })

        if self.model_class == 'Classification':
            # performance metric for classification
            # threshold = 0.5
            # y_pred_train_proba = fitted_model.predict_proba(X_train)
            # y_pred_test_proba = fitted_model.predict_proba(X_test)
            # y_pred_train = (y_pred_train_proba[:, 0] >= threshold).astype('int')
            # y_pred_test = (y_pred_test_proba[:, 0] >= threshold).astype('int')
            y_pred_train = fitted_model.predict(X_train)
            y_pred_test = fitted_model.predict(X_test)
            results.update({
                'accuracy_train': round(accuracy_score(y_train, y_pred_train), 3),
                'f1_train': round(f1_score(y_train, y_pred_train), 3),
                'precision_train': round(precision_score(y_train, y_pred_train), 3),
                'recall_train': round(recall_score(y_train, y_pred_train), 3),
                'accuracy_test': round(accuracy_score(y_test, y_pred_test), 3),
                'f1_test': round(f1_score(y_test, y_pred_test), 3),
                'precision_test': round(precision_score(y_test, y_pred_test), 3),
                'recall_test': round(recall_score(y_test, y_pred_test), 3),
            })

        if self.model in ['Linear', 'Ridge', 'Lasso', 'Polynomial', 'Logistic']:
            # parametric models
            results.update({
                'coeff': fitted_model.coef_,
                'intercept': fitted_model.intercept_,
                'variables': list(X_train.columns),
            })

        return results

    def calibration(self) -> float | Any:
        # split
        X_train, X_test, y_train, y_test = train_test_split(self.X, self.y, test_size=0.3, random_state=3)

        if self.model == 'Polynomial':
            poly_features = PolynomialFeatures(degree=self.parameters[0], include_bias=False)
            X_train = poly_features.fit_transform(X_train)
            X_test = poly_features.fit_transform(X_test)
            poly_cols = poly_features.get_feature_names_out()
            X_train = pd.DataFrame(X_train, columns=poly_cols)
            X_test = pd.DataFrame(X_test, columns=poly_cols)

        # train model
        self.fit_reg = self.modelObject.fit(X_train, y_train)

        # Randomized Search
        if self.model == 'DecisionTree':
            param_grid = {
                'max_features': [1, 2, 5, 10, 20],
                'max_depth': [1, 2, 5, 10, 20],
                'max_leaf_nodes': [2, 3, 5, 10, 20]
            }
            grid_search = RandomizedSearchCV(self.fit_reg, param_grid, cv=5)
            grid_search.fit(X_train, y_train)
            self.best_params = grid_search.best_params_

        return self.results(self.fit_reg, X_train, X_test, y_train, y_test)

    def learning_curves(self):
        X_train, X_val, y_train, y_val = train_test_split(self.X, self.y, test_size=0.3, random_state=3)
        train_errors, val_errors = [], []
        for m in range(1, len(X_train)):
            self.modelObject.fit(X_train[:m], y_train[:m])
            y_train_predict = self.modelObject.predict(X_train[:m])
            y_val_predict = self.modelObject.predict(X_val)
            train_errors.append(r2_score(y_train[:m], y_train_predict))
            val_errors.append(r2_score(y_val, y_val_predict))

        # replace nan
        train_errors = [0 if (pd.isna(x) or x < 0) else x for x in train_errors]
        val_errors = [0 if (pd.isna(x) or x < 0) else x for x in val_errors]

        return train_errors, val_errors

    def precision_recall_curves(self):
        X_train, X_val, y_train, y_val = train_test_split(self.X, self.y, test_size=0.3, random_state=3)
        self.modelObject.fit(X_train, y_train)
        precision_train, recall_train, thr = precision_recall_curve(
            y_train, self.modelObject.predict_proba(X_train)[:, 1])
        precision_test, recall_test, thr = precision_recall_curve(
            y_val, self.modelObject.predict_proba(X_val)[:, 1])

        return precision_train, recall_train, precision_test, recall_test, thr

    def shap_explainer(self):
        X_train, X_test, y_train, y_test = train_test_split(self.X, self.y, test_size=0.3, random_state=3)
        explainer = shap.Explainer(self.fit_reg, X_train)
        ev = explainer.expected_value
        shap_values = explainer.shap_values(X_test)
        shap_values= pd.DataFrame(shap_values, columns=X_train.columns)
        vals = np.abs(shap_values.values).mean(0)
        results = dict(zip(X_train.columns,vals))
        results.update({'ev': ev[0] if isinstance(ev, np.ndarray) else ev})
        return results

    def pipeline(self, df):
        self.transform(df)
        results = self.calibration()
        if self.model_class == 'Regression':
            train_error, test_error = self.learning_curves()
            results.update({'train_error': train_error})
            results.update({'test_error': test_error})
        elif self.model_class == 'Classification':
            precision_train, recall_train, precision_test, recall_test, thr = self.precision_recall_curves()
            results.update({'thresholds': thr})
            results.update({'precision_train_curve': precision_train})
            results.update({'precision_test_curve': precision_test})
            results.update({'recall_train_curve': recall_train})
            results.update({'recall_test_curve': recall_test})
        if self.model == 'DecisionTree':
            results.update({'hyper_param': self.best_params})

        # add Shapley values
        if self.model_class == 'Regression':
            shaps = self.shap_explainer()
            results.update({'shapley': shaps})

        for key in results.keys():
            results[key] = default(results[key])

        return results

if __name__ == '__main__':
    # m = Regression(['price'], ['area', 'bedrooms', 'stories', 'guestroom', 'airconditioning'], 'Regression')
    # m.set_model('Lasso')
    # print(m.pipeline(dfs['housing']))

    m = Regression(['Hospitalized'], ['Age', 'Gender', 'BMI'], 'Classification')
    # m.set_model('AdaBoost')
    # print(m.pipeline(dfs['covid']))

    m.set_model('Dummy', strategy='stratified')
    print(m.pipeline(dfs['covid']))

    # m = Regression(['virginica'], ['petal width (cm)'], 'Classification')
    # m.set_model('SVC')
    # print(m.pipeline(df))

    # @staticmethod
    # def correlations(target: object, features: object):
    #     # set target and features
    #     y = df[target]
    #     X = df[features]
    #
    #     # split numerical/categorical features
    #     categorical_features = [feature for feature in features if is_string_dtype(X[feature])]
    #     numerical_features = [feature for feature in features if is_numeric_dtype(X[feature])]
    #
    #     # one-hot encode categorical features
    #     if categorical_features:
    #         X_encoded = pd.get_dummies(X[categorical_features])
    #         X = pd.concat([X.drop(categorical_features, axis=1), X_encoded], axis=1)
    #
    #     # matrix
    #     C = pd.concat([y, X], axis=1).corr()
    #     rho = C.reset_index().rename(columns={'index': 'feature'})
    #
    #     return dict(zip(rho['feature'], rho[target]))


