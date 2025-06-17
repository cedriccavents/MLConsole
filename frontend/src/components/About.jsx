const About = () => {
    return (
        <div style={{"padding": "15px"}}>
            <h2>Making ML models simpler</h2>
            The aim of this tool is to simplify the creation of ML models for small to medium datasets. 
            No need to write the code for the models yourself! Just use one of the toy datasets or upload your 
            own dataset and experiment with a wide range models.
            <br />
            <br />
            <h2>Implementation</h2>
            The models run in Python in the backend. All Regression and Classification models are sklearn
            models. The deep learning models are built on TensorFlow.
            <br />
            <br />
            <h2>Get started now!</h2>
Want to use AI for a business, research project or charitable organization, but not sure where to start?
As a thank you for using our product at this early stage, we would love to help you explore different use cases relevant to your project, and show you how you can make the most out of ML Console.
        </div>
    )
}

export default About