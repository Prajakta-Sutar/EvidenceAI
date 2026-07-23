import gradio as gr
from model import classifier


demo = gr.Interface(
    fn=classifier,
    inputs=[gr.Textbox(label="Question")],
    outputs=gr.Textbox(label="Response")
)

demo.launch()