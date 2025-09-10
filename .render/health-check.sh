#!/bin/bash

# Health check script for monitoring
curl -f http://localhost:3001/health || exit 1
