# EvidenceAI

## Current Progress

- ✅ Created initial Gradio interface for testing AI assistant workflow
- ✅ Integrated LLM-based question classification
- ✅ Added query filtering:
  - Irrelevant questions are handled separately
  - Ambiguous questions request clarification
  - Relevant questions currently not processed
- 🚧 Working on retrieval pipeline
  - Pipeline is working properly
  - Assistant model is ansering the questions but quality of response is low.
  - Retriever is pulling correct information, but incomplete 🚨🚨. Need to revise chunking.
  - Included repomix to unified whole project repository into sigle file
  - Produced in depth overview of each project by passing repomix output to LLM (analyst_llm).
  - analyst_llm returns in-depth overview of projects in json format.
  - Using different chunking statergies based on file type. 
  - After hybrid chunking, and using same retrival as before, 
    retrival quality has been improved significantly. 🥳🎉.
    Retrived evidence are NOT incomplete anymore. 
  - Retrival is retriving separate chunks from same file as evidence, 
    instead of combining them as one🚨🚨.
  - Query generator is creating relevant queries 🥳🎉. 
  
