# .sinatra-backend
alias run="PYTHONPATH=$(pwd) exec uvicorn main:app --reload --reload-dir=$(pwd)"