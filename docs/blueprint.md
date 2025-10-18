# **App Name**: RapidSense

## Core Features:

- Sensor Data Aggregation: Collect and normalize data from various sensors (rain, wind, river level, seismic) and citizen reports (e.g., Waze) into a unified data stream.
- AI-Powered Risk Assessment: Use a multi-modal, time-series AI model to analyze aggregated sensor data and Waze reports, then predict and classify disaster risk levels.
- Real-time Alerting & Notification: Dispatch immediate alerts to stakeholders (officials, first responders, citizens) based on risk assessment, tailored by location and role, over multiple channels (push, SMS, email). The LLM will act as a tool and decide whether to add location or role based personalization
- SIP4D Integration: Bidirectional integration with SIP4D for data sharing and common situational awareness among municipalities and disaster response agencies, leveraging standard APIs for incidents, observations, and resource requests. The data collected will then be shown on the map.
- Waze Integration: Incorporate real-time traffic incidents (congestion, flooding, road closures) from Waze for Cities (CCP) to supplement risk assessments, and enable authorities to publish official closure information to Waze users.
- Management Console: Provide a real-time dashboard with map views, sensor status, AI scores, historical logs, and rule management UI for thresholds and alert templates. Allow role-based access control (RBAC) for secure administration.

## Style Guidelines:

- Primary color: HSL(210, 70%, 45%) - A vibrant, trustworthy blue (#3699FF) evoking safety and reliability.
- Background color: HSL(210, 20%, 95%) - A light, desaturated blue (#F0F8FF) providing a calm backdrop.
- Accent color: HSL(180, 60%, 50%) - A contrasting teal (#33D9E1) for highlighting critical alerts and interactive elements.
- Font pairing: 'Space Grotesk' (sans-serif) for headlines and 'Inter' (sans-serif) for body text, lending a modern, tech-forward feel.
- Use clear, universally understandable icons for sensor types, alert levels, and actions, ensuring intuitive comprehension.
- Prioritize map-based visualizations with interactive layers for sensors, risk zones, and Waze incidents. Display alert details with concise explanations derived from AI reasoning.
- Incorporate subtle animations to draw attention to critical alerts and real-time updates on the dashboard. Keep animations minimal and non-intrusive.