
'use server';
/**
 * @fileOverview A client for interacting with the IO.net API.
 */

const API_ENDPOINT = 'https://api.io.net/v1';

async function createJob(payload: any): Promise<any> {
    const apiKey = process.env.IONET_API_KEY;
    if (!apiKey) {
        throw new Error('IONET_API_KEY is not set in environment variables.');
    }

    try {
        const response = await fetch(`${API_ENDPOINT}/jobs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`IO.net API Error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to create IO.net job:', error);
        throw error;
    }
}

/**
 * Submits an intelligence job to IO.net.
 * @param prompt The natural language prompt for the job.
 * @param dataSource The data source for the job.
 * @returns The response from the IO.net API.
 */
export async function submitIntelligenceJob(prompt: string, dataSource: string) {
    const userId = process.env.IONET_USER_ID;
    if (!userId) {
        throw new Error('IONET_USER_ID is not set in environment variables.');
    }
    
    const payload = {
        user_id: userId,
        job_name: `intelligence-job-${new Date().toISOString()}`,
        // This is a simplified example. The actual payload would be more complex
        // and depend on the specifics of the IO.net Intelligence API.
        // For now, we'll model it based on a generic job submission.
        container: {
            image: 'ubuntu:22.04', // A generic image for demonstration
            command: [
                '/bin/bash', 
                '-c', 
                `echo "Running intelligence job. Prompt: ${prompt}. Datasource: ${dataSource}" && sleep 60`
            ],
        },
        device: {
            gpu_type: 'A100', // Example from prompt
            gpu_count: 1,
        },
        job_type: 'one-off',
    };

    return createJob(payload);
}

/**
 * Schedules an automated agent job on IO.net.
 * @param jobName The name of the job.
 * @param schedule The cron schedule for the job.
 * @param taskDefinition The definition of the task.
 * @returns The response from the IO.net API.
 */
export async function scheduleAgentJob(jobName: string, schedule: string, taskDefinition: string) {
    const userId = process.env.IONET_USER_ID;
     if (!userId) {
        throw new Error('IONET_USER_ID is not set in environment variables.');
    }

    const payload = {
        user_id: userId,
        job_name: jobName,
        schedule: schedule,
        // Similar to the intelligence job, this is a simplified representation.
        container: {
            image: 'python:3.10', // Example for a retraining job
            command: [
                '/bin/bash',
                '-c',
                `echo "Running agent task: ${taskDefinition}" && pip install scikit-learn && echo "Simulating model optimization"`
            ],
        },
        device: {
            gpu_type: 'RTX_3090', // A cost-effective GPU for background tasks
            gpu_count: 1,
        },
        job_type: 'recurring',
    };

    return createJob(payload);
}
