import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const FrontPage = () => {

    const navigate = useNavigate()

    const handleClick = () => {
        navigate("/dataset")
    }

    return (
        <div>
            <div className="content-wrapper">
                <h1>Build powerful AI models in one click</h1>
                <p>
                    Unlock the potential of AI for your company, your side-gig,
                    or school-project.
                </p>
                <p>
                    <strong>ML Console</strong> allows everyone to build powerful machine learning models 
                    for free  and in less than a minute: no advanced AI expertise, lengthy sign-ups or credit-card 
                    info required!
                </p>
                <Button variant="primary" onClick={handleClick}>Get started</Button>
            </div>
            <footer>
                <div className="banner">
                    <h3>Trusted by teams to build simple ML models </h3>
                    <h5>Designed by Cedric Cavents</h5>
                </div>
            </footer>

        </div>

    )
}

export default FrontPage