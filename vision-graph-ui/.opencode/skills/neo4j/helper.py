#!/usr/bin/env python3
import subprocess
import argparse
import json
import sys
import os
from pathlib import Path


def run_command(cmd):
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return result.returncode, result.stdout, result.stderr


def up(args):
    compose_file = Path("docker-compose.yml")
    if not compose_file.exists():
        print("Error: docker-compose.yml not found. Run 'generate-compose' first.")
        return 1
    code, stdout, stderr = run_command("docker compose up -d")
    if code == 0:
        print("Neo4j started successfully.")
        print("Browser: http://localhost:7474")
        print("Bolt: bolt://localhost:7687")
        return 0
    else:
        print(f"Error starting Neo4j: {stderr}")
        return 1


def down(args):
    code, stdout, stderr = run_command("docker compose down -v")
    if code == 0:
        print("Neo4j stopped and data cleared.")
        return 0
    else:
        print(f"Error stopping Neo4j: {stderr}")
        return 1


def status(args):
    code, stdout, stderr = run_command("docker compose ps")
    if code == 0:
        if "whitt-neo4j" in stdout and "Up" in stdout:
            print("Neo4j: running on :7474 (HTTP) and :7687 (Bolt)")
            return 0
        else:
            print("Neo4j: stopped")
            return 0
    else:
        print(f"Error checking status: {stderr}")
        return 1


def seed(args):
    seed_file = Path(args.file)
    if not seed_file.exists():
        print(f"Error: Seed file not found: {args.file}")
        return 1
    code, stdout, stderr = run_command(f"cat {seed_file} | cypher-shell -u neo4j -p password bolt://localhost:7687")
    if code == 0:
        print(f"Seed data loaded from {args.file}")
        return 0
    else:
        print(f"Error seeding data: {stderr}")
        return 1


def query(args):
    cypher = args.cypher
    code, stdout, stderr = run_command(f"echo '{cypher}' | cypher-shell -u neo4j -p password bolt://localhost:7687 --format plain")
    if code == 0:
        try:
            lines = stdout.strip().split('\n')
            if len(lines) > 1:
                headers = lines[0].split('|')
                headers = [h.strip() for h in headers if h.strip()]
                records = []
                for line in lines[2:]:
                    if line.strip() and '|---' not in line:
                        values = [v.strip() for v in line.split('|') if v.strip()]
                        if len(values) == len(headers):
                            record = dict(zip(headers, values))
                            records.append(record)
                print(json.dumps(records, indent=2))
            else:
                print("No results")
            return 0
        except Exception as e:
            print(f"Error parsing results: {e}")
            print(stdout)
            return 1
    else:
        print(f"Error executing query: {stderr}")
        return 1


def generate_compose(args):
    compose_content = """version: '3.8'
services:
  neo4j:
    image: neo4j:5.15-community
    container_name: whitt-neo4j
    ports:
      - "7474:7474"
      - "7687:7687"
    environment:
      - NEO4J_AUTH=neo4j/password
      - NEO4J_PLUGINS=["apoc"]
      - NEO4J_dbms_security_procedures_unrestricted=apoc.*
    volumes:
      - neo4j_data:/data
      - neo4j_logs:/logs
      - neo4j_import:/import
      - neo4j_plugins:/plugins

volumes:
  neo4j_data:
  neo4j_logs:
  neo4j_import:
  neo4j_plugins:
"""
    
    env_content = """NEO4J_AUTH=neo4j/password
NEO4J_PLUGINS=["apoc"]
NEO4J_dbms_security_procedures_unrestricted=apoc.*
"""
    
    compose_file = Path("docker-compose.yml")
    env_file = Path(".env")
    
    compose_file.write_text(compose_content)
    env_file.write_text(env_content)
    
    print("Generated docker-compose.yml and .env")
    print("Run 'up' to start Neo4j")
    return 0


def main():
    parser = argparse.ArgumentParser(description="Neo4j helper for Whitt Graph UI")
    subparsers = parser.add_subparsers(dest='command', help='Available commands')
    
    up_parser = subparsers.add_parser('up', help='Start Neo4j Docker container')
    up_parser.set_defaults(func=up)
    
    down_parser = subparsers.add_parser('down', help='Stop Neo4j Docker container and clear data')
    down_parser.set_defaults(func=down)
    
    status_parser = subparsers.add_parser('status', help='Check Neo4j container status')
    status_parser.set_defaults(func=status)
    
    seed_parser = subparsers.add_parser('seed', help='Load seed data from Cypher file')
    seed_parser.add_argument('file', help='Path to Cypher seed file')
    seed_parser.set_defaults(func=seed)
    
    query_parser = subparsers.add_parser('query', help='Execute Cypher query and return JSON')
    query_parser.add_argument('cypher', help='Cypher query to execute')
    query_parser.set_defaults(func=query)
    
    generate_parser = subparsers.add_parser('generate-compose', help='Generate docker-compose.yml and .env')
    generate_parser.set_defaults(func=generate_compose)
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return 1
    
    return args.func(args)


if __name__ == '__main__':
    sys.exit(main())