import { Table } from "react-bootstrap"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

import { setTarget, setFeatures, selectFeatures } from "../reducers/steps"
import { setXLabel } from "../reducers/steps"

export const Step = ({label, text, isDisabled}) => {

    return (
        <div>
            <button disabled={isDisabled}>
                <div className="step-number">{label}</div>
                <div className="step-name">{text}</div>
            </button>
        </div>
    )
}

export const Row = ({header, val=0}) => {

    const dispatch = useDispatch()
    const target = useSelector(state => {
        return state.steps.target
    })

    const [checked, setChecked] = useState(true)
    let isDisabled = false

    if (header === target){
        isDisabled = true
    }

    const changedVal = () => {
        setChecked(!checked)
        dispatch(selectFeatures({feature: header, include: checked}))
    }

    const changeChart = () => {
        dispatch(setXLabel(header))
    }

    return (
        <tr>
            <th>
                <span>
                    <input 
                        type="checkbox" 
                        disabled={isDisabled} 
                        defaultChecked={checked} 
                        onClick={changedVal}/>
                </span><button className="features-button" onClick={changeChart}>{header}</button>
                </th>
            <th>{val}</th>
        </tr>
    )
}

const FeaturesDropDown = ({features, values}) => {

    const dispatch = useDispatch()

    const handleClick = (e) => {
        e.preventDefault()
        dispatch(setTarget(e.target.value))
        dispatch(setFeatures(features))
    }

    return (
        <div>
            <select onChange={e => handleClick(e)}>
                {
                    features.map((f, i) => <option value={f} key={i}>{f}</option>)
                }
            </select>
        </div>
    )
}

export const TargetTable = ({cols, vals}) => {
    return (
        <FeaturesDropDown features={cols}/>
    )
}

const FeaturesTable = ({cols, vals}) => {

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Variable</th>
                        <th>Correlation</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        cols.map((col, i) => <Row header={col} key={i} val={vals[i]}/>)
                    }
                </tbody>
            </table>
        </div>
    )
}

export default FeaturesTable