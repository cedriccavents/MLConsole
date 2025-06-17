import kagglehub
from kagglehub import KaggleDatasetAdapter
import pandas as pd

# Download latest version
path = kagglehub.dataset_download("yasserh/housing-prices-dataset")
print("Path to dataset files:", path)

path = kagglehub.dataset_download("khushikyad001/covid-19-reinfection-and-health-dataset")
print("Path to dataset files:", path)

df = kagglehub.dataset_download("muthuj7/weather-dataset")
print("Path to dataset files:", path)
