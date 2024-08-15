#!/bin/bash

# Function to run command and check output
run_and_validate() {
    local command="$1"
    local expected_output="$2"

    # Run the command and capture its output
    output=$(eval "$command")

    # Check if the output is empty
    if [ -z "$output" ]; then
        echo "Error: Command '$command' produced no output."
        exit 1
    fi

    # If expected output is provided, check if it matches
    if [ -n "$expected_output" ]; then
        if [[ "$output" == *"$expected_output"* ]]; then
            echo "Success: Command output contains expected text."
            echo "Output: $output"
    
        else
            echo "Error: Command output does not contain expected text."
            echo "Output: $output"
            echo "Expected: $expected_output"
            exit 1
        fi
    else
        echo "Success: Command produced output."
        echo "Output: $output"
        return 0
    fi
}

check_file_exists() {
    local file="$1"
    local should_exist="$2"

    if [ "$should_exist" = true ] && [ -f "$file" ]; then
        echo "Success: File '$file' exists as expected."

    elif [ "$should_exist" = false ] && [ ! -f "$file" ]; then
        echo "Success: File '$file' does not exist as expected."
    else
        if [ "$should_exist" = true ]; then
            echo "Error: File '$file' does not exist, but it should."
        else
            echo "Error: File '$file' exists, but it shouldn't."
        fi
        exit 1
    fi
}


echo "### 1: Validating basic usage\n"
run_and_validate "docker run --rm console" "No Recipe found - cannot continue"

echo "### 2: Validating help command\n"
run_and_validate "docker run --rm console --help" "Show version information"

# Validate that recipe.yml file does not exists
echo "### 3: Validating recipe.yml file does not exists\n"
check_file_exists "recipe.yml" false


echo "### 4: Save basic recipe\n"
run_and_validate "docker run --rm -v \"$(pwd):/app\" console --generate-sample-recipe" "Sample recipe generated and saved"

# Validate that recipe.yml file exists
echo "#### 5: Validating recipe.yml file exists\n"
check_file_exists "recipe.yml" true
