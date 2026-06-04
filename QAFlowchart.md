<pre>
```mermaid
flowchart TB
    %% Removed the layout: elk config to allow GitHub to render it natively
    Start{"Is QA important <br> in a team?"} -- No --> first["Lost Trust & Brand Damage"]
    first -- and --> second["100x Financial Cost"]
    second -- and --> third["The 'Firefighting' Trap"]
    third -- and --> fourth["Security & Compliance Risks"]
    fourth -- and --> fifth["Fragmented UX"]
    fifth -- and --> sixth["Team Burnout & Blame"]
    
    sixth -- Once they understand the value --> Step1["Step 1: Exploratory testing <br> with traditional testing types"]
    Start -- Yes --> Step1
    
    Step1 -- When you find a bug --> ReportBug["Report the bug accordingly"]
    ReportBug -- Resume testing --> Step1
    
    Step1 -- Exploration complete --> Step2["Step 2: Draw App flow <br> & action diagram"]
    Step2 --> Step3["Step 3: Write Functional, Edge cases, Security, <br> Performance, UI/UX, Usability & Compatibility test cases"]
    Step3 --> FinalQuestion{"What is the Fourth <br> logical step?"}

    %% Added classDef lines to define the styles for the assigned classes
    classDef decision fill:#f9d0c4,stroke:#333,stroke-width:2px;
    classDef noPath fill:#ffcccc,stroke:#cc0000,stroke-width:2px;
    classDef yesPath fill:#ccffcc,stroke:#00cc00,stroke-width:2px;
    classDef bugPath fill:#fff0b3,stroke:#e6b800,stroke-width:2px;

    %% Correctly assigned classes
    class Start,FinalQuestion decision
    class first,second,third,fourth,fifth,sixth noPath
    class Step1,Step2,Step3 yesPath
    class ReportBug bugPath

</pre>
```
