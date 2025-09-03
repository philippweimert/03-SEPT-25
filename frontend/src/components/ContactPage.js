import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useToast } from "../hooks/use-toast";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: ""
  });
  const { toast } = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('https://cloud.seatable.io/dtable-db/api/v1/rows/', {
        method: 'POST',
        headers: {
          'Authorization': 'Token 313262eba5ae256ea74921ab3067c01a98f99cd7',
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          'table_name': 'Table1',
          'row': {
            'Name': formData.name,
            'Email': formData.email,
            'Unternehmen': formData.company,
            'Telefon': formData.phone,
            'Nachricht': formData.message
          }
        })
      });

      if (response.ok) {
        toast({
          title: "Nachricht gesendet!",
          description: "Vielen Dank für Ihre Anfrage. Wir melden uns schnellstmöglich bei Ihnen.",
        });
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          company: "",
          phone: "",
          message: ""
        });
      } else {
        const errorData = await response.json();
        console.error('Error from SeaTable:', errorData);
        throw new Error(errorData.error_message || 'Fehler beim Senden der Nachricht an SeaTable');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: "Fehler beim Senden",
        description: "Es gab ein Problem beim Senden Ihrer Nachricht. Bitte versuchen Sie es erneut.",
        variant: "destructive"
      });
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "E-Mail",
      content: "info@acencia.de",
      link: "mailto:info@acencia.de"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Telefon",
      content: "+49 (0) 6701 123456",
      link: "tel:+4967011234567"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Adresse",
      content: "ACENCIA GmbH\nHackenheim, Deutschland",
      link: null
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Öffnungszeiten",
      content: "Mo-Fr: 8:00-18:00 Uhr\nSa: 9:00-13:00 Uhr",
      link: null
    }
  ];

  return (
    <div className="min-h-screen bg-acencia">
      <Header />
      
      <div className="pt-32 bg-acencia">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-acencia via-acencia to-acencia py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="absolute top-20 right-0 w-96 h-96" viewBox="0 0 400 400">
            <polygon points="200,50 350,150 350,250 200,350 50,250 50,150" 
                     fill="none" stroke="white" strokeWidth="2"/>
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              <span className="text-orange-500">Kontakt</span> aufnehmen
            </h1>
            <p className="text-lg text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Haben Sie Fragen zur betrieblichen Altersvorsorge? Wir sind für Sie da!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section - identischer Farbverlauf wie About Page */}
      <section className="bg-gradient-to-b from-acencia via-acencia-light to-acencia-blue py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <div>
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-slate-900">
                    Nachricht senden
                  </CardTitle>
                  <p className="text-slate-600">
                    Füllen Sie das Formular aus und wir melden uns schnellstmöglich bei Ihnen.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Name *
                        </label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full"
                          placeholder="Ihr vollständiger Name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          E-Mail *
                        </label>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full"
                          placeholder="ihre.email@beispiel.de"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Unternehmen
                        </label>
                        <Input
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          className="w-full"
                          placeholder="Ihr Unternehmen"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Telefon
                        </label>
                        <Input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full"
                          placeholder="+49 123 456789"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Nachricht *
                      </label>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="w-full"
                        placeholder="Beschreiben Sie Ihr Anliegen oder Ihre Fragen zur betrieblichen Altersvorsorge..."
                      />
                    </div>

                    <Button 
                      type="submit"
                      size="lg"
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3"
                    >
                      Nachricht senden
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">
                  Kontaktinformationen
                </h2>
                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <Card key={index} className="border-slate-200 hover:border-orange-500 transition-colors duration-200">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="text-orange-500 mt-1">
                            {info.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900 mb-1">
                              {info.title}
                            </h3>
                            {info.link ? (
                              <a 
                                href={info.link}
                                className="text-slate-600 hover:text-orange-500 transition-colors duration-200 whitespace-pre-line"
                              >
                                {info.content}
                              </a>
                            ) : (
                              <p className="text-slate-600 whitespace-pre-line">
                                {info.content}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4">
                    Schnelle Terminbuchung
                  </h3>
                  <p className="text-slate-300 mb-6">
                    Buchen Sie direkt einen Beratungstermin in unserem Online-Kalender.
                  </p>
                  <Button 
                    size="lg"
                    variant="outline"
                    className="w-full border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                    onClick={() => window.open('https://outlook.office365.com/owa/calendar/ACENCIAde@acencia.de/bookings/', '_blank')}
                  >
                    Jetzt Termin vereinbaren
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      </div>
    </div>
  );
};

export default ContactPage;