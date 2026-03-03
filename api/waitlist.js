// small talk - Waitlist API Endpoint
// Simple serverless function for handling waitlist signups

const fs = require('fs').promises;
const path = require('path');

// For Vercel serverless functions
module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only accept POST requests
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    try {
        const data = req.body;

        // Validate required fields
        const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'city', 'plan'];
        const missingFields = requiredFields.filter(field => !data[field]);

        if (missingFields.length > 0) {
            res.status(400).json({
                error: 'Missing required fields',
                fields: missingFields
            });
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            res.status(400).json({ error: 'Invalid email format' });
            return;
        }

        // Validate Australian phone number
        const phoneRegex = /^(?:\+?61|0)[2-478](?:[ -]?[0-9]){8}$/;
        const phoneClean = data.phone.replace(/\s/g, '');
        if (!phoneRegex.test(phoneClean)) {
            res.status(400).json({ error: 'Invalid Australian phone number' });
            return;
        }

        // Create waitlist entry
        const entry = {
            id: generateId(),
            ...data,
            phone: phoneClean,
            createdAt: new Date().toISOString(),
            status: 'pending'
        };

        // In production, save to database (Airtable, Supabase, etc.)
        // For now, we'll simulate saving and return a success response

        // Simulate getting the waitlist position
        const position = await getWaitlistPosition(entry.email);

        // Send confirmation email (integrate with SendGrid, Resend, etc.)
        // await sendConfirmationEmail(entry);

        res.status(200).json({
            success: true,
            message: 'Successfully joined the waitlist',
            position: position,
            data: {
                id: entry.id,
                email: entry.email,
                firstName: entry.firstName
            }
        });

    } catch (error) {
        console.error('Waitlist API error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to process waitlist signup'
        });
    }
};

// Helper functions

function generateId() {
    return `wl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

async function getWaitlistPosition(email) {
    // In production, query the database for actual position
    // For now, return a random position between 100-500
    return Math.floor(Math.random() * 400) + 100;
}

async function sendConfirmationEmail(entry) {
    // TODO: Integrate with email service (SendGrid, Resend, etc.)
    // Example with Resend:
    /*
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
        from: 'Small Talk <hello@small-talk.com.au>',
        to: entry.email,
        subject: "You're on the list! 🎉",
        html: `
            <h1>Welcome to small talk, ${entry.firstName}!</h1>
            <p>Talk Less. Connect More. 話すより、つながる</p>
            <p>You're officially on the waitlist. We'll email you when we launch in February 2027.</p>
            <h2>Your Founding Member Perks:</h2>
            <ul>
                <li>🎁 Extra 10GB data on your first recharge</li>
                <li>💰 Early bird pricing locked in for 6 months</li>
                <li>✨ Priority activation - skip the queue</li>
            </ul>
            <p>In the meantime, follow us on TikTok and Instagram @smalltalk_au</p>
        `
    });
    */
    console.log(`Confirmation email would be sent to ${entry.email}`);
}

// For local development/testing
if (require.main === module) {
    const http = require('http');

    const server = http.createServer(async (req, res) => {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            req.body = JSON.parse(body || '{}');
            await module.exports(req, res);
        });
    });

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`Waitlist API running on http://localhost:${PORT}`);
    });
}
