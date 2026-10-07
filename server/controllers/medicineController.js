//import Medicine from '../models/Medicine.js';
/* import Medicine from '../models/Medicine.js';
import CaregiverProfile from '../models/CaregiverProfile.js';

export const getMedicines = async (req, res) => {
  try {
    const patientId = req.user._id;
    const medicines = await Medicine.find({ patient: patientId }).sort({ time: 1 });
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get medicines' });
  }
};

export const addMedicine = async (req, res) => {
  try {
    const patientId = req.user._id;
    if (req.user.role !== 'caregiver') return res.status(403).json({ message: 'Permission denied' });

    const { name, dosage, time, instructions } = req.body;

    const medicine = new Medicine({
      patient: patientId,
      name,
      dosage,
      time,
      instructions,
      status: 'pending',
    });
    await medicine.save();
    res.status(201).json(medicine);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add medicine' });
  }
};

export const updateMedicine = async (req, res) => {
  try {
    if (req.user.role !== 'caregiver') return res.status(403).json({ message: 'Permission denied' });

    const medId = req.params.id;
    const update = req.body;
    const medicine = await Medicine.findByIdAndUpdate(medId, update, { new: true });
    if (!medicine) return res.status(404).json({ message: 'Medicine not found' });
    res.json(medicine);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update medicine' });
  }
};

export const deleteMedicine = async (req, res) => {
  try {
    if (req.user.role !== 'caregiver') return res.status(403).json({ message: 'Permission denied' });

    const medId = req.params.id;
    await Medicine.findByIdAndDelete(medId);
    res.json({ message: 'Medicine deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete medicine' });
  }
}; */

import Medicine from '../models/Medicine.js';
import CaregiverProfile from '../models/CaregiverProfile.js';

// ==========================================
// GET MEDICINES
// Patient → gets own medicines
// Caregiver → gets linked patient's medicines
// ==========================================

export const getMedicines = async (req, res) => {
  try {
    let patientId;

    // PATIENT
    if (req.user.role === 'patient') {
      patientId = req.user._id;
    }

    // CAREGIVER
    else if (req.user.role === 'caregiver') {
      const caregiverProfile = await CaregiverProfile.findOne({
        user: req.user._id,
      });

      if (!caregiverProfile) {
        return res.status(404).json({
          message: 'Caregiver profile not found',
        });
      }

      patientId = caregiverProfile.patient;
    }

    else {
      return res.status(403).json({
        message: 'Permission denied',
      });
    }

    if (!patientId) {
      return res.status(400).json({
        message: 'No patient is linked to this caregiver',
      });
    }

    const medicines = await Medicine.find({
      patient: patientId,
    }).sort({ time: 1 });

    res.json(medicines);

  } catch (error) {
    console.error('Get medicines error:', error);

    res.status(500).json({
      message: 'Failed to get medicines',
    });
  }
};


// ==========================================
// ADD MEDICINE
// Only caregiver
// ==========================================

export const addMedicine = async (req, res) => {
  try {
    if (req.user.role !== 'caregiver') {
      return res.status(403).json({
        message: 'Permission denied',
      });
    }

    const caregiverProfile = await CaregiverProfile.findOne({
      user: req.user._id,
    });

    if (!caregiverProfile) {
      return res.status(404).json({
        message: 'Caregiver profile not found',
      });
    }

    const patientId = caregiverProfile.patient;

    if (!patientId) {
      return res.status(400).json({
        message: 'No patient is linked to this caregiver',
      });
    }

    const {
      name,
      dosage,
      time,
      instructions,
    } = req.body;

    if (!name || !dosage || !time) {
      return res.status(400).json({
        message: 'Medicine name, dosage and time are required',
      });
    }

    const medicine = new Medicine({
      patient: patientId,
      name: name.trim(),
      dosage: dosage.trim(),
      time,
      instructions: instructions?.trim() || '',
      status: 'pending',
    });

    await medicine.save();

    res.status(201).json(medicine);

  } catch (error) {
    console.error('Add medicine error:', error);

    res.status(500).json({
      message: 'Failed to add medicine',
    });
  }
};


// ==========================================
// UPDATE MEDICINE
// Only caregiver
// ==========================================

export const updateMedicine = async (req, res) => {
  try {
    if (req.user.role !== 'caregiver') {
      return res.status(403).json({
        message: 'Permission denied',
      });
    }

    const caregiverProfile = await CaregiverProfile.findOne({
      user: req.user._id,
    });

    if (!caregiverProfile) {
      return res.status(404).json({
        message: 'Caregiver profile not found',
      });
    }

    const patientId = caregiverProfile.patient;

    if (!patientId) {
      return res.status(400).json({
        message: 'No patient is linked to this caregiver',
      });
    }

    const medicine = await Medicine.findOne({
      _id: req.params.id,
      patient: patientId,
    });

    if (!medicine) {
      return res.status(404).json({
        message: 'Medicine not found or permission denied',
      });
    }

    const {
      name,
      dosage,
      time,
      instructions,
    } = req.body;

    if (name !== undefined) {
      medicine.name = name.trim();
    }

    if (dosage !== undefined) {
      medicine.dosage = dosage.trim();
    }

    if (time !== undefined) {
      medicine.time = time;
    }

    if (instructions !== undefined) {
      medicine.instructions = instructions.trim();
    }

    await medicine.save();

    res.json(medicine);

  } catch (error) {
    console.error('Update medicine error:', error);

    res.status(500).json({
      message: 'Failed to update medicine',
    });
  }
};


// ==========================================
// DELETE MEDICINE
// Only caregiver
// ==========================================

export const deleteMedicine = async (req, res) => {
  try {
    if (req.user.role !== 'caregiver') {
      return res.status(403).json({
        message: 'Permission denied',
      });
    }

    const caregiverProfile = await CaregiverProfile.findOne({
      user: req.user._id,
    });

    if (!caregiverProfile) {
      return res.status(404).json({
        message: 'Caregiver profile not found',
      });
    }

    const patientId = caregiverProfile.patient;

    if (!patientId) {
      return res.status(400).json({
        message: 'No patient is linked to this caregiver',
      });
    }

    const deletedMedicine =
      await Medicine.findOneAndDelete({
        _id: req.params.id,
        patient: patientId,
      });

    if (!deletedMedicine) {
      return res.status(404).json({
        message: 'Medicine not found or permission denied',
      });
    }

    res.json({
      message: 'Medicine deleted successfully',
    });

  } catch (error) {
    console.error('Delete medicine error:', error);

    res.status(500).json({
      message: 'Failed to delete medicine',
    });
  }
};


// ==========================================
// UPDATE MEDICINE STATUS
// Patient can mark medicine as taken/pending
// ==========================================

export const updateMedicineStatus = async (req, res) => {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({
        message: 'Only patients can update medicine status',
      });
    }

    const { status } = req.body;

    if (!['pending', 'done'].includes(status)) {
      return res.status(400).json({
        message: 'Invalid medicine status',
      });
    }

    const medicine = await Medicine.findOne({
      _id: req.params.id,
      patient: req.user._id,
    });

    if (!medicine) {
      return res.status(404).json({
        message: 'Medicine not found',
      });
    }

    medicine.status = status;

    await medicine.save();

    res.json(medicine);

  } catch (error) {
    console.error('Update medicine status error:', error);

    res.status(500).json({
      message: 'Failed to update medicine status',
    });
  }
};