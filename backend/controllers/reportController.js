const ReportModel = require("../models/reportModel");

const createReport = async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.location || !req.body.time || !req.body.crimeType) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const photos = req.files?.photos?.map(file => file.path) || [];
    const videos = req.files?.videos?.map(file => file.path) || [];

    const reportId = await ReportModel.create(
      req.body.location,
      req.body.time,
      req.body.crimeType,
      req.body.numCriminals,
      req.body.victimGender,
      req.body.armed,
      photos,
      videos
    );

    res.status(201).json({
      success: true,
      message: "Report created successfully",
      data: { id: reportId }
    });
  } catch (error) {
    console.error("Report creation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create report",
      error: error.message
    });
  }
};

const getAllReports = async (req, res) => {
  try {
    const reports = await ReportModel.getAll();
    res.status(200).json({
      success: true,
      data: reports
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reports",
      error: error.message
    });
  }
};

module.exports = {
  createReport,
  getAllReports
};