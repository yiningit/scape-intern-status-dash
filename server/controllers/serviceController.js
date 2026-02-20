import Service from '../models/serviceModel.js';
import { DEFAULT_SERVICES } from '../defaults/services.defaults.js';

export const getServices = async (req, res) => {
    try {
        const services = await Service.find().sort({ createdAt: 1 });
        res.status(200).json(services);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch services", error: err.message });
    }
};

export const createService = async (req, res) => {
    try {
        const { service, url, type, data } = req.body;
        if (!service) return res.status(400).json({ message: "Service name is required" });
        if (!url) return res.status(400).json({ message: "Service URL is required" });
        if (!type) return res.status(400).json({ message: "Service type is required" });

        const created = await Service.create({
            service, 
            url,
            type,
            data,
        });

        res.status(201).json(created);
    } catch (err) {
        // Handle duplicate service name
        if (err.code === 11000) return res.status(409).json({ message: "Service name already exists." });
        res.status(500).json({ message: "Failed to create service.", error: err.message });
    }
};

export const deleteService = async (req, res) => {
    try {
        const deleted = await Service.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Service not found" });
        res.json({ message: "Service deleted successfully ", ok: true })   // DO WE EVER CHECK THIS OK?
    } catch (err) {
        res.status(500).json({ message: "Failed to delete service", error: err.message });
    }
};

export const resetAllServices = async (req, res) => {
  try {
    // Wipe entire collection
    await Service.deleteMany({});

    // Insert defaults
    const inserted = await Service.insertMany(DEFAULT_SERVICES, { ordered: true });

    return res.status(201).json({ ok: true, count: DEFAULT_SERVICES.length, services: inserted });
  } catch (err) {
    console.error(`Reset to defaults failed: ${err}`);
    return res.status(500).json({ ok: false, message: "Reset failed", error: err.message });
  }
};