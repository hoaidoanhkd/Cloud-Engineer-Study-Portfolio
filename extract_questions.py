#!/usr/bin/env python3
import re
import json
import os
from bs4 import BeautifulSoup

def extract_questions():
    all_questions = []
    
    # Map parts to their question ranges
    parts = {
        1: "1-50",
        2: "51-100", 
        3: "101-150",
        4: "151-200",
        5: "201-250",
        6: "251-302"
    }
    
    for part_num, range_str in parts.items():
        file_path = f"quiz-parts/part{part_num}-questions-{range_str}.html"
        
        if not os.path.exists(file_path):
            continue
            
        print(f"Processing {file_path}...")
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        soup = BeautifulSoup(content, 'html.parser')
        question_divs = soup.find_all('div', class_='question')
        
        for div in question_divs:
            question_id = div.get('id', '')
            if not question_id.startswith('question'):
                continue
                
            question_num = int(re.search(r'question(\d+)', question_id).group(1))
            
            # Extract question text
            question_content = div.find('div', class_='question-content')
            if not question_content:
                continue
                
            question_p = question_content.find('p')
            if not question_p:
                continue
                
            question_text = question_p.get_text(strip=True)
            
            # Extract options
            options = []
            answer_inputs = div.find_all('input', type='radio')
            
            for input_elem in answer_inputs:
                option_value = input_elem.get('value', '')
                # Find the text after the input
                option_text = ""
                next_sibling = input_elem.next_sibling
                if next_sibling:
                    if hasattr(next_sibling, 'strip'):
                        option_text = next_sibling.strip()
                    else:
                        option_text = str(next_sibling).strip()
                
                if option_text and option_value:
                    options.append({
                        "id": option_value,
                        "text": option_text,
                        "isCorrect": False
                    })
            
            if question_text and len(options) > 0:
                question_obj = {
                    "id": f"q{question_num}",
                    "questionNumber": question_num,
                    "text": question_text,
                    "options": options,
                    "correctAnswer": "",
                    "explanation": "",
                    "category": "GCP",
                    "difficulty": "medium",
                    "source": f"part{part_num}"
                }
                
                all_questions.append(question_obj)
    
    # Sort by question number
    all_questions.sort(key=lambda x: x['questionNumber'])
    
    print(f"Extracted {len(all_questions)} questions")
    
    # Save to JSON file
    with open('src/data/questions.json', 'w', encoding='utf-8') as f:
        json.dump(all_questions, f, indent=2, ensure_ascii=False)
    
    print("Questions saved to src/data/questions.json")
    return all_questions

if __name__ == "__main__":
    questions = extract_questions()