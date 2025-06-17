import { Link } from "react-router-dom"
import Latex from "react-latex-next"


const Docs = () => {
    return (
        <div className="two-column-layout">
            <div style={{"padding": "20px"}}>
                <p>Regression</p>
                <ul><li><Link to="/linear">Linear</Link></li></ul>
                <ul><li><Link to="/Polynomial">Polynomial</Link></li></ul>
                <ul><li><Link to="/regulariation">Regularization</Link></li></ul>
                <p>Classification</p>
                <ul><li><Link to="/SVM">Support Vector Machine</Link></li></ul>
                <p>Trees</p>
                <ul><li><Link to="/Decision">Decision</Link></li></ul>
                <ul><li><Link to="/RandomForest">Random Forest</Link></li></ul>
                <ul><li><Link to="/AdaBoost">AdaBoosting</Link></li></ul>
                <ul><li><Link to="/GradientBoost">GradientBoosting</Link></li></ul>
            </div>
            <div style={{"padding": "20px"}}>
                Linear Regression is the most basic ML model. Generally, a linear regression model 
                is represented in the form: <p>When \(ax^2 + bx + c = 0\)</p>
            </div>
        </div>
    )
}

export default Docs