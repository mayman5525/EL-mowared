const { Supplier, SupplierService } = require("../models");

module.exports = {
  // Create a new service for a specific supplier
  async createService(req, res) {
    try {
      const { supplierId } = req.params;
      const { serviceName, description } = req.body;

      // Ensure the supplier exists
      const supplier = await Supplier.findByPk(supplierId);
      if (!supplier) {
        return res.status(404).json({ error: "Supplier not found" });
      }

      const service = await SupplierService.create({
        serviceName,
        description,
        supplierId,
      });

      res.status(201).json(service);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create service" });
    }
  },

  // Get all services for a specific supplier
  async getServicesBySupplier(req, res) {
    try {
      const { supplierId } = req.params;

      // Ensure the supplier exists
      const supplier = await Supplier.findByPk(supplierId);
      if (!supplier) {
        return res.status(404).json({ error: "Supplier not found" });
      }

      const services = await SupplierService.findAll({
        where: { supplierId },
      });

      res.json(services);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch services" });
    }
  },

  // Get a specific service by its ID
  async getServiceById(req, res) {
    try {
      const { supplierId, serviceId } = req.params;

      // Ensure the supplier exists
      const supplier = await Supplier.findByPk(supplierId);
      if (!supplier) {
        return res.status(404).json({ error: "Supplier not found" });
      }

      const service = await SupplierService.findOne({
        where: { id: serviceId, supplierId },
      });

      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }

      res.json(service);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch service" });
    }
  },

  // Update a service for a specific supplier
  async updateService(req, res) {
    try {
      const { supplierId, serviceId } = req.params;
      const { serviceName, description } = req.body;

      // Ensure the supplier exists
      const supplier = await Supplier.findByPk(supplierId);
      if (!supplier) {
        return res.status(404).json({ error: "Supplier not found" });
      }

      const service = await SupplierService.findOne({
        where: { id: serviceId, supplierId },
      });

      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }

      // Update the service
      service.serviceName = serviceName || service.serviceName;
      service.description = description || service.description;

      await service.save();

      res.json(service);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update service" });
    }
  },

  // Delete a service by ID
  async deleteService(req, res) {
    try {
      const { supplierId, serviceId } = req.params;

      // Ensure the supplier exists
      const supplier = await Supplier.findByPk(supplierId);
      if (!supplier) {
        return res.status(404).json({ error: "Supplier not found" });
      }

      const service = await SupplierService.findOne({
        where: { id: serviceId, supplierId },
      });

      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }

      await service.destroy();

      res.status(204).json({ message: "Service deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete service" });
    }
  },
};
