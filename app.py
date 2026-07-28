import gradio as gr
from model import classifier


demo = gr.Interface(
    fn=classifier,
    inputs=[gr.Textbox(label="Question")],
    outputs=[
        gr.Markdown(label="Summary"), 
        gr.JSON(label="evidence")
    ]
)

demo.launch()