import gradio as gr
import time
from model import classifier


start = time.perf_counter()
demo = gr.Interface(
    fn=classifier,
    inputs=[gr.Textbox(label="Question")],
    outputs=[
        gr.Markdown(label="Summary"), 
        gr.JSON(label="evidence")
    ]
)

print(f"Final LLM: {time.perf_counter() - start:.3f} seconds")

demo.launch()