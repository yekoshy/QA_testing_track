<pre>
```mermaid
---
config:
  layout: elk
---
flowchart TB
    %% Replaced the experimental @{} syntax with standard syntax
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
    
    %% Changed &amp; back to & (Mermaid handles & natively inside quotes)
    Step1 -- Exploration complete --> Step2["Step 2: Draw App flow <br> & action diagram"]
    Step2 --> Step3["Step 3: Write Functional, Edge cases, Security, <br> Performance, UI/UX, Usability & Compatibility test cases"]
    Step3 --> FinalQuestion{"What is the Fourth <br> logical step?"}

    %% Correctly assigned classes using the "class" keyword
    class Start,FinalQuestion decision
    class first,second,third,fourth,fifth,sixth noPath
    class Step1,Step2,Step3 yesPath
    class ReportBug bugPath
  ```
</pre>
