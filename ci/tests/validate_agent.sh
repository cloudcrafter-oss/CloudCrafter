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
        return 1
    fi

    # If expected output is provided, check if it matches
    if [ -n "$expected_output" ]; then
        if [[ "$output" == *"$expected_output"* ]]; then
            echo "Success: Command output contains expected text."
            echo "Output: $output"
            return 0
        else
            echo "Error: Command output does not contain expected text."
            echo "Output: $output"
            echo "Expected: $expected_output"
            return 1
        fi
    else
        echo "Success: Command produced output."
        echo "Output: $output"
        return 0
    fi
}

# Example usage
run_and_validate "docker run --rm console" "No Recipe found - cannot continue"
