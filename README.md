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
  - Evolved query generator to return not only queries, but also instructions for final
    LLM model. In other words, created dynamic prompting. 
  - The response quality, format has been improved significantly after dynamic prompting 🥳🥳🥳🥳🥳🥳. 
  - Assistant is taking too much time to response - LOOKING FOR BOTTLENECK COMPONENET
    - Bottleneck is assisant LLM and retriever 🚨🚨.
    - Main reason for retriver time is due to statergist model. 
        - Combined statergist and classifier as one model. 
        - Added parallel query execution using threads.
        - Reduced retrieval latency from several seconds to less than 1 second 🥳🥳🥳🥳🥳🥳.
            🔴 BEFORE -
              Classifier: 0.740 seconds
              Retriever inside assistant: 3.597 seconds
              Prompt creation: 0.000 seconds
              Final LLM: 4.762 seconds
              Total Assistant: 8.360 seconds

            🟢 AFTER -
                Classifier: 1.332 seconds
                Retriever inside assistant: 0.725 seconds
                Prompt creation: 0.001 seconds
                Final LLM: 6.965 seconds
                Total Assistant: 7.692 seconds                
  - Now the main bottleneck is assistant LLM 🚨🚨.
  - Switched from gpt-5.4-mini to gpt-5.6-luna. Response quality is better and faster. 
  - Implemented streaming for assistant LLM's response. Instead of printing whole
  output at once, user can read the response as LLM generates 🥳🥳. 
  - Added conversation history support to maintain context across recruiter interactions 🥳🥳.
      - Due to histroy, LLM can understand pronounce like "it", "her" as relation to previous conversation. 
      - Chat with LLM feels like human conversation 🥳🥳.🥳🥳.🥳🥳.🥳🥳.

