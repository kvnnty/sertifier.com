export interface Certificate {
  id: number;
  name: string;
  category: string;
  backgroundImage?: string;
  width: number;
  height: number;
  backgroundColor: string;
  elements: CertificateElement[];
}

export interface CertificateElement {
  id: number;
  type: string;
  content: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  textAlign: 'left' | 'center' | 'right';
  fontWeight?: string;
  fontStyle?: string;
  letterSpacing?: string;
  rotation?: number;
  width?: number;
  height?: number;

  [key: string]: any; 
}

export const MOCK_CERTIFICATES:Certificate[] =[
  {
    "id": 1,
    "name": "Modern Achievement Certificate",
    "category": "Achievement",
    "backgroundImage": "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop",
    "width": 800,
    "height": 600,
    "backgroundColor": "#f8f9fa",
    "elements": [
      {
        "id": 1,
        "type": "text",
        "content": "CERTIFICATE",
        "x": 400,
        "y": 120,
        "fontSize": 42,
        "fontFamily": "Arial Black",
        "color": "#2C3E50",
        "textAlign": "center",
        "fontWeight": "bold"
      },
      {
        "id": 2,
        "type": "text",
        "content": "OF ACHIEVEMENT",
        "x": 400,
        "y": 160,
        "fontSize": 16,
        "fontFamily": "Arial",
        "color": "#7F8C8D",
        "textAlign": "center",
        "letterSpacing": "3px"
      },
      {
        "id": 3,
        "type": "text",
        "content": "[recipient.name]",
        "x": 400,
        "y": 280,
        "fontSize": 32,
        "fontFamily": "Georgia",
        "color": "#E74C3C",
        "textAlign": "center",
        "fontStyle": "italic"
      },
      {
        "id": 4,
        "type": "text",
        "content": "has successfully completed the requirements for",
        "x": 400,
        "y": 340,
        "fontSize": 14,
        "fontFamily": "Arial",
        "color": "#34495E",
        "textAlign": "center"
      },
      {
        "id": 5,
        "type": "text",
        "content": "[course.name]",
        "x": 400,
        "y": 380,
        "fontSize": 24,
        "fontFamily": "Arial",
        "color": "#2C3E50",
        "textAlign": "center",
        "fontWeight": "bold"
      },
      {
        "id": 6,
        "type": "text",
        "content": "Date: [date]",
        "x": 150,
        "y": 500,
        "fontSize": 12,
        "fontFamily": "Arial",
        "color": "#7F8C8D",
        "textAlign": "left"
      },
      {
        "id": 7,
        "type": "text",
        "content": "Signature: [signature]",
        "x": 650,
        "y": 500,
        "fontSize": 12,
        "fontFamily": "Arial",
        "color": "#7F8C8D",
        "textAlign": "right"
      }
    ]
  },
  {
    "id": 2,
    "name": "Training Certificate",
    "category": "Training",
    "backgroundImage": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop",
    "width": 800,
    "height": 600,
    "backgroundColor": "#1a5f3f",
    "elements": [
      {
        "id": 1,
        "type": "text",
        "content": "Training Certificate",
        "x": 400,
        "y": 100,
        "fontSize": 36,
        "fontFamily": "Arial",
        "color": "#FFFFFF",
        "textAlign": "center",
        "fontWeight": "bold"
      },
      {
        "id": 2,
        "type": "text",
        "content": "This certifies that",
        "x": 400,
        "y": 180,
        "fontSize": 16,
        "fontFamily": "Arial",
        "color": "#ECF0F1",
        "textAlign": "center"
      },
      {
        "id": 3,
        "type": "text",
        "content": "[recipient.name]",
        "x": 400,
        "y": 240,
        "fontSize": 28,
        "fontFamily": "Georgia",
        "color": "#F39C12",
        "textAlign": "center",
        "fontStyle": "italic"
      },
      {
        "id": 4,
        "type": "text",
        "content": "has completed the training program",
        "x": 400,
        "y": 300,
        "fontSize": 14,
        "fontFamily": "Arial",
        "color": "#ECF0F1",
        "textAlign": "center"
      },
      {
        "id": 5,
        "type": "text",
        "content": "[training.program]",
        "x": 400,
        "y": 340,
        "fontSize": 22,
        "fontFamily": "Arial",
        "color": "#FFFFFF",
        "textAlign": "center",
        "fontWeight": "bold"
      },
      {
        "id": 6,
        "type": "text",
        "content": "Duration: [duration] hours",
        "x": 400,
        "y": 400,
        "fontSize": 12,
        "fontFamily": "Arial",
        "color": "#BDC3C7",
        "textAlign": "center"
      },
      {
        "id": 7,
        "type": "text",
        "content": "Issued on [date]",
        "x": 400,
        "y": 480,
        "fontSize": 12,
        "fontFamily": "Arial",
        "color": "#BDC3C7",
        "textAlign": "center"
      }
    ]
  },
  {
    "id": 3,
    "name": "Elegant Award Certificate",
    "category": "Award",
    "backgroundImage": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
    "width": 800,
    "height": 600,
    "backgroundColor": "#2c1810",
    "elements": [
      {
        "id": 1,
        "type": "text",
        "content": "AWARD",
        "x": 400,
        "y": 80,
        "fontSize": 38,
        "fontFamily": "Georgia",
        "color": "#D4AF37",
        "textAlign": "center",
        "fontWeight": "bold",
        "letterSpacing": "4px"
      },
      {
        "id": 2,
        "type": "text",
        "content": "CERTIFICATE",
        "x": 400,
        "y": 120,
        "fontSize": 24,
        "fontFamily": "Georgia",
        "color": "#CD853F",
        "textAlign": "center",
        "letterSpacing": "2px"
      },
      {
        "id": 3,
        "type": "text",
        "content": "Presented to",
        "x": 400,
        "y": 200,
        "fontSize": 18,
        "fontFamily": "Georgia",
        "color": "#F4E4BC",
        "textAlign": "center",
        "fontStyle": "italic"
      },
      {
        "id": 4,
        "type": "text",
        "content": "[recipient.name]",
        "x": 400,
        "y": 260,
        "fontSize": 34,
        "fontFamily": "Georgia",
        "color": "#D4AF37",
        "textAlign": "center",
        "fontWeight": "bold"
      },
      {
        "id": 5,
        "type": "text",
        "content": "In recognition of outstanding achievement in",
        "x": 400,
        "y": 320,
        "fontSize": 14,
        "fontFamily": "Georgia",
        "color": "#F4E4BC",
        "textAlign": "center"
      },
      {
        "id": 6,
        "type": "text",
        "content": "[achievement.field]",
        "x": 400,
        "y": 360,
        "fontSize": 20,
        "fontFamily": "Georgia",
        "color": "#CD853F",
        "textAlign": "center",
        "fontWeight": "bold"
      },
      {
        "id": 7,
        "type": "text",
        "content": "Awarded this [day] day of [month], [year]",
        "x": 400,
        "y": 450,
        "fontSize": 12,
        "fontFamily": "Georgia",
        "color": "#F4E4BC",
        "textAlign": "center",
        "fontStyle": "italic"
      }
    ]
  },
  {
    "id": 4,
    "name": "Professional Completion Certificate",
    "category": "Completion",
    "backgroundImage": "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=600&fit=crop",
    "width": 800,
    "height": 600,
    "backgroundColor": "#f8f9fa",
    "elements": [
      {
        "id": 1,
        "type": "text",
        "content": "CERTIFICATE OF COMPLETION",
        "x": 400,
        "y": 100,
        "fontSize": 28,
        "fontFamily": "Arial",
        "color": "#2C3E50",
        "textAlign": "center",
        "fontWeight": "bold",
        "letterSpacing": "1px"
      },
      {
        "id": 2,
        "type": "text",
        "content": "This is to certify that",
        "x": 400,
        "y": 180,
        "fontSize": 16,
        "fontFamily": "Arial",
        "color": "#34495E",
        "textAlign": "center"
      },
      {
        "id": 3,
        "type": "text",
        "content": "[participant.name]",
        "x": 400,
        "y": 240,
        "fontSize": 30,
        "fontFamily": "Georgia",
        "color": "#8E44AD",
        "textAlign": "center",
        "fontWeight": "bold"
      },
      {
        "id": 4,
        "type": "text",
        "content": "has successfully completed all requirements for",
        "x": 400,
        "y": 300,
        "fontSize": 14,
        "fontFamily": "Arial",
        "color": "#34495E",
        "textAlign": "center"
      },
      {
        "id": 5,
        "type": "text",
        "content": "[program.title]",
        "x": 400,
        "y": 340,
        "fontSize": 22,
        "fontFamily": "Arial",
        "color": "#2C3E50",
        "textAlign": "center",
        "fontWeight": "bold"
      },
      {
        "id": 6,
        "type": "text",
        "content": "Completion Date: [completion.date]",
        "x": 200,
        "y": 450,
        "fontSize": 12,
        "fontFamily": "Arial",
        "color": "#7F8C8D",
        "textAlign": "left"
      },
      {
        "id": 7,
        "type": "text",
        "content": "Certificate ID: [certificate.id]",
        "x": 600,
        "y": 450,
        "fontSize": 12,
        "fontFamily": "Arial",
        "color": "#7F8C8D",
        "textAlign": "right"
      },
      {
        "id": 8,
        "type": "text",
        "content": "Authorized Signature",
        "x": 600,
        "y": 520,
        "fontSize": 10,
        "fontFamily": "Arial",
        "color": "#95A5A6",
        "textAlign": "center"
      }
    ]
  },
  {
    "id": 5,
    "name": "Academic Excellence Certificate",
    "category": "Academic",
    "backgroundImage": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop",
    "width": 800,
    "height": 600,
    "backgroundColor": "#1e3a8a",
    "elements": [
      {
        "id": 1,
        "type": "text",
        "content": "ACADEMIC EXCELLENCE",
        "x": 400,
        "y": 90,
        "fontSize": 32,
        "fontFamily": "Arial",
        "color": "#FFFFFF",
        "textAlign": "center",
        "fontWeight": "bold",
        "letterSpacing": "2px"
      },
      {
        "id": 2,
        "type": "text",
        "content": "CERTIFICATE",
        "x": 400,
        "y": 130,
        "fontSize": 20,
        "fontFamily": "Arial",
        "color": "#FCD34D",
        "textAlign": "center",
        "letterSpacing": "3px"
      },
      {
        "id": 3,
        "type": "text",
        "content": "This certifies that",
        "x": 400,
        "y": 200,
        "fontSize": 16,
        "fontFamily": "Arial",
        "color": "#E5E7EB",
        "textAlign": "center"
      },
      {
        "id": 4,
        "type": "text",
        "content": "[student.name]",
        "x": 400,
        "y": 260,
        "fontSize": 32,
        "fontFamily": "Georgia",
        "color": "#FCD34D",
        "textAlign": "center",
        "fontWeight": "bold"
      },
      {
        "id": 5,
        "type": "text",
        "content": "has demonstrated exceptional academic performance",
        "x": 400,
        "y": 320,
        "fontSize": 14,
        "fontFamily": "Arial",
        "color": "#E5E7EB",
        "textAlign": "center"
      },
      {
        "id": 6,
        "type": "text",
        "content": "[subject.area]",
        "x": 400,
        "y": 360,
        "fontSize": 24,
        "fontFamily": "Arial",
        "color": "#FFFFFF",
        "textAlign": "center",
        "fontWeight": "bold"
      },
      {
        "id": 7,
        "type": "text",
        "content": "GPA: [gpa.score]",
        "x": 400,
        "y": 420,
        "fontSize": 16,
        "fontFamily": "Arial",
        "color": "#FCD34D",
        "textAlign": "center",
        "fontWeight": "bold"
      },
      {
        "id": 8,
        "type": "text",
        "content": "Academic Year: [academic.year]",
        "x": 400,
        "y": 480,
        "fontSize": 12,
        "fontFamily": "Arial",
        "color": "#E5E7EB",
        "textAlign": "center"
      }
    ]
  },
  {
    "id": 6,
    "name": "Workshop Participation Certificate",
    "category": "Workshop",
    "backgroundImage": "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
    "width": 800,
    "height": 600,
    "backgroundColor": "#059669",
    "elements": [
      {
        "id": 1,
        "type": "text",
        "content": "WORKSHOP",
        "x": 400,
        "y": 80,
        "fontSize": 36,
        "fontFamily": "Arial",
        "color": "#FFFFFF",
        "textAlign": "center",
        "fontWeight": "bold"
      },
      {
        "id": 2,
        "type": "text",
        "content": "PARTICIPATION CERTIFICATE",
        "x": 400,
        "y": 120,
        "fontSize": 16,
        "fontFamily": "Arial",
        "color": "#D1FAE5",
        "textAlign": "center",
        "letterSpacing": "2px"
      },
      {
        "id": 3,
        "type": "text",
        "content": "We hereby certify that",
        "x": 400,
        "y": 200,
        "fontSize": 16,
        "fontFamily": "Arial",
        "color": "#ECFDF5",
        "textAlign": "center"
      },
      {
        "id": 4,
        "type": "text",
        "content": "[participant.name]",
        "x": 400,
        "y": 260,
        "fontSize": 30,
        "fontFamily": "Georgia",
        "color": "#FDE68A",
        "textAlign": "center",
        "fontWeight": "bold"
      },
      {
        "id": 5,
        "type": "text",
        "content": "has actively participated in the workshop",
        "x": 400,
        "y": 320,
        "fontSize": 14,
        "fontFamily": "Arial",
        "color": "#ECFDF5",
        "textAlign": "center"
      },
      {
        "id": 6,
        "type": "text",
        "content": "[workshop.title]",
        "x": 400,
        "y": 360,
        "fontSize": 22,
        "fontFamily": "Arial",
        "color": "#FFFFFF",
        "textAlign": "center",
        "fontWeight": "bold"
      },
      {
        "id": 7,
        "type": "text",
        "content": "Workshop Date: [workshop.date]",
        "x": 200,
        "y": 440,
        "fontSize": 12,
        "fontFamily": "Arial",
        "color": "#D1FAE5",
        "textAlign": "left"
      },
      {
        "id": 8,
        "type": "text",
        "content": "Duration: [workshop.duration]",
        "x": 600,
        "y": 440,
        "fontSize": 12,
        "fontFamily": "Arial",
        "color": "#D1FAE5",
        "textAlign": "right"
      },
      {
        "id": 9,
        "type": "text",
        "content": "Facilitator: [facilitator.name]",
        "x": 400,
        "y": 500,
        "fontSize": 12,
        "fontFamily": "Arial",
        "color": "#D1FAE5",
        "textAlign": "center"
      }
    ]
  }
]