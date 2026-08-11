# EvidenceAI

## Current Progress

- ✅ Created initial Gradio interface for testing AI assistant workflow
- ✅ Integrated LLM-based question classification
- ✅ Added query filtering:
  - Irrelevant questions are handled separately
  - Ambiguous questions request clarification
  - Relevant questions currently not processed
- Retrieval pipeline
  - Pipeline is working properly
  - Assistant model is answering the questions but quality of response is low.
  - 🚨🚨 Retriever is pulling correct information, but incomplete. Need to revise chunking.
      - Included repomix to unified whole project repository into single file
      - Produced in depth overview of each project by passing repomix output to LLM (analyst_llm).
      - analyst_llm returns in-depth overview of projects in json format.
      - Using different chunking statergies based on file type. 
      - ✅ ✅ After hybrid chunking, and using same retrieval as before, retrieval quality has been improved significantly.
        Retrived evidence are NOT incomplete anymore. 
      - ✅ ✅ Developed Query generator which creates multiple relevant queries. 
      - Evolved query generator to return not only queries, but also instructions for final LLM model. In other words, created dynamic prompting. 
      - ✅ ✅ The response quality, format has been improved significantly after dynamic prompting.
   -🚨🚨 Assistant is taking too much time to response - LOOKING FOR BOTTLENECK COMPONENT  
      -Bottleneck is assistant LLM and retriever .
      - Main reason for retriver time is due to statergist model. 
          - Combined statergist and classifier as one model. 
          - Added parallel query execution using threads.
          - ✅ ✅ ✅ ✅ ✅ ✅Reduced retrieval latency from several seconds to less than 1 second.
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
  - 🚨🚨 Now the main bottleneck is assistant LLM .
      - Switched from gpt-5.4-mini to gpt-5.6-luna. Response quality is better and faster. 
      - Implemented streaming for assistant LLM's response. Instead of printing whole output at once, user can read the response as LLM generates.
      - ✅ ✅ ✅ ✅ ✅ ✅ The assistant begins streaming within approximately 1–2 seconds for cached or simple queries and ~ 3–4 seconds for
        database-backed queries requiring deeper retrieval, significantly improving perceived responsiveness.
  - ✅ ✅ Added conversation history support to maintain context across recruiter interactions.
      - Due to histroy, LLM can understand pronounce like "it", "her" as relation to previous conversation. 
      - Chat with LLM feels like human conversation.
  - Assistant LLM is successfully choosing when to include evidence , when not. 
  - Built the frontend UI using React and React Bootstrap.
  - Implemented a responsive interface that adapts to different screen sizes. Successfully implemented 
    navigation and dynamic rendering of different pages based on user interactions.
  - 🏆🏆🏆 Win : 
      - When a user selects a skill from the main portfolio or project page, the assistant LLM explains how the candidate has used that skill
        and provides relevant evidence alongside the response.
      - Implemented support for answering questions submitted directly through the assistant's text input.
      - When relevant evidence is unavailable, the evidence panel remains closed.
      - LLM do not provide answers for irrelevant questions or questions asking for personal information. 


  -🚧🚧🚧🚧 Currently working on deployment. 
