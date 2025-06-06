var maintenance = false; // Or true depending on the maintenance state
// Function to update maintenance status
window.dispatchEvent(new CustomEvent('maintenanceChange', { detail: maintenance }));
// Example update
// updateMaintenanceStatus(false); //